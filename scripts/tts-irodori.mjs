#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join } from "node:path";

const args = parseArgs(process.argv.slice(2));
const latencyProfile = startLatencyProfile(args["profile-latency"]);
const baseURL = (args.url ?? process.env.IRODORI_TTS_URL ?? "http://127.0.0.1:8088").replace(/\/$/, "");
const model = args.model ?? process.env.IRODORI_TTS_MODEL ?? "irodori-tts";
const voice = args.voice ?? process.env.IRODORI_TTS_VOICE ?? "none";
const format = args.format ?? process.env.IRODORI_TTS_FORMAT ?? "wav";

if (args["health"]) {
  try {
    await measureLatency(latencyProfile, "health", () => health());
    printLatencyProfile(latencyProfile, { provider: "irodori", success: true, health: true });
    process.exit(0);
  } catch (error) {
    console.error(`tts-irodori: ${error?.message ?? String(error)}`);
    printLatencyProfile(latencyProfile, { provider: "irodori", success: false, health: true });
    process.exit(1);
  }
}

const text = args.text ?? (await measureLatency(latencyProfile, "read_stdin", () => readStdin()));

if (text.trim().length === 0) {
  console.error("tts-irodori: text is empty");
  printLatencyProfile(latencyProfile, { provider: "irodori", success: false, reason: "empty_text" });
  process.exit(2);
}

try {
  const out = await measureLatency(latencyProfile, "synthesis", () => synthesize());
  console.log(out);

  if (args.play) {
    const status = measureLatency(latencyProfile, "play", () => playAudio(out));
    printLatencyProfile(latencyProfile, { provider: "irodori", success: status === 0, play: true });
    process.exit(status);
  }

  printLatencyProfile(latencyProfile, { provider: "irodori", success: true, play: false });
} catch (error) {
  console.error(`tts-irodori: ${error?.message ?? String(error)}`);
  printLatencyProfile(latencyProfile, { provider: "irodori", success: false });
  process.exit(1);
}

async function health() {
  const response = await request(`${baseURL}/health`);
  console.log(JSON.stringify(await response.json(), null, 2));
}

async function synthesize() {
  const payload = {
    model,
    input: text,
    voice,
    response_format: format,
  };

  if (args.speed) payload.speed = Number(args.speed);
  if (args.seed || args["num-steps"]) {
    payload.irodori = {
      ...(args.seed ? { seed: Number(args.seed) } : {}),
      ...(args["num-steps"] ? { num_steps: Number(args["num-steps"]) } : {}),
    };
  }

  const response = await request(`${baseURL}/v1/audio/speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const audio = Buffer.from(await measureLatency(latencyProfile, "read_audio", () => response.arrayBuffer()));
  const out = args.out ?? join(mkdtempSync(join(tmpdir(), "talking-pets-irodori-")), `speech.${format}`);
  measureLatency(latencyProfile, "write_audio", () => writeFileSync(out, audio));
  return out;
}

async function request(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new Error(`unable to connect to ${url}: ${error.message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`${response.status} ${response.statusText} ${body}`.trim());
  }

  return response;
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--play" || arg === "--health" || arg === "--profile-latency") {
      result[arg.slice(2)] = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value == null) {
      throw new Error(`${arg} requires a value`);
    }
    result[key] = value;
    i += 1;
  }

  return result;
}

function startLatencyProfile(enabled) {
  if (!enabled) return null;
  return {
    startedAt: performance.now(),
    steps: [],
  };
}

function measureLatency(profile, name, operation) {
  if (!profile) return operation();

  const startedAt = performance.now();
  const record = () => {
    profile.steps.push({ name, ms: performance.now() - startedAt });
  };

  try {
    const result = operation();
    if (result && typeof result.finally === "function") {
      return result.finally(record);
    }
    record();
    return result;
  } catch (error) {
    record();
    throw error;
  }
}

function printLatencyProfile(profile, fields) {
  if (!profile) return;
  const totalMs = performance.now() - profile.startedAt;
  const steps = profile.steps.map(step => `${step.name}=${formatLatencyMs(step.ms)}`).join(" ");
  const metadata = Object.entries(fields).map(([key, value]) => `${key}=${value}`).join(" ");
  console.error(`[latency] total=${formatLatencyMs(totalMs)} ${steps} ${metadata}`.trim());
}

function formatLatencyMs(ms) {
  return `${ms.toFixed(1)}ms`;
}

function playAudio(path) {
  if (process.platform === "darwin") {
    return spawnSync("/usr/bin/afplay", [path], { stdio: "inherit" }).status ?? 1;
  }

  if (process.platform === "win32") {
    const escaped = path.replaceAll("'", "''");
    const script = `$p = New-Object System.Media.SoundPlayer '${escaped}'; $p.PlaySync()`;
    return spawnSync("powershell.exe", ["-NoProfile", "-Command", script], { stdio: "inherit" }).status ?? 1;
  }

  for (const command of ["aplay", "paplay", "ffplay"]) {
    const commandArgs = command === "ffplay" ? ["-nodisp", "-autoexit", path] : [path];
    const result = spawnSync(command, commandArgs, { stdio: "inherit" });
    if (result.status === 0) {
      return 0;
    }
    if (result.error?.code !== "ENOENT") {
      return result.status ?? 1;
    }
  }

  console.error(`tts-irodori: no audio player found for ${process.platform}`);
  return 1;
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", chunk => {
      data += chunk;
    });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}
