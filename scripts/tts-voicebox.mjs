#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { windowsPowerShellCommand } from "./audio-platform.mjs";

const scriptPath = fileURLToPath(import.meta.url);

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const latencyProfile = startLatencyProfile(args["profile-latency"]);
  const baseURL = (args.url ?? process.env.VOICEBOX_URL ?? "http://127.0.0.1:50021").replace(/\/$/, "");
  const mode = args.mode ?? process.env.VOICEBOX_MODE ?? (baseURL.includes(":50021") ? "voicevox" : "generic");
  const endpoint = args.endpoint ?? process.env.VOICEBOX_ENDPOINT ?? "/speak";
  const text = args.text ?? (args["list-voices"] ? "" : await readStdin());

  if (args["list-voices"]) {
    await measureLatency(latencyProfile, "list_voices", () => listVoices(baseURL));
    printLatencyProfile(latencyProfile, { provider: mode, success: true, listVoices: true });
    return;
  }

  if (text.trim().length === 0) {
    printLatencyProfile(latencyProfile, { provider: mode, success: false, reason: "empty_text" });
    throw Object.assign(new Error("text is empty"), { exitCode: 2 });
  }

  if (mode === "voicevox") {
    await speakWithVoicevox({ args, baseURL, text, latencyProfile, mode });
  } else {
    await speakWithGenericEndpoint({ args, baseURL, endpoint, text, latencyProfile });
  }
  printLatencyProfile(latencyProfile, { provider: mode, success: true, play: Boolean(args.play) });
}

if (process.argv[1] === scriptPath) {
  main().catch(error => {
    console.error(`tts-voicebox: ${error?.message ?? String(error)}`);
    process.exit(error?.exitCode ?? 1);
  });
}

async function listVoices(baseURL) {
  const response = await request(`${baseURL}/speakers`);
  console.log(JSON.stringify(await response.json(), null, 2));
}

async function speakWithVoicevox({ args, baseURL, text, latencyProfile, mode }) {
  const speaker = args.speaker ?? args["speaker-id"] ?? args["profile-id"] ?? process.env.VOICEBOX_SPEAKER ?? "3";
  const queryURL = `${baseURL}/audio_query?text=${encodeURIComponent(text)}&speaker=${encodeURIComponent(speaker)}`;
  const synthesisURL = `${baseURL}/synthesis?speaker=${encodeURIComponent(speaker)}`;

  const queryResponse = await measureLatency(latencyProfile, "audio_query", () => request(queryURL, { method: "POST" }));
  const query = await measureLatency(latencyProfile, "parse_audio_query", () => queryResponse.json());

  if (args.speed) {
    query.speedScale = Number(args.speed);
  }
  if (args.pitch) {
    query.pitchScale = Number(args.pitch);
  }
  if (args.intonation) {
    query.intonationScale = Number(args.intonation);
  }

  const audioResponse = await measureLatency(latencyProfile, "synthesis", () => request(synthesisURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  }));
  const audio = Buffer.from(await measureLatency(latencyProfile, "read_audio", () => audioResponse.arrayBuffer()));
  const out = args.out ?? join(mkdtempSync(join(tmpdir(), "talking-pets-voicevox-")), "speech.wav");
  measureLatency(latencyProfile, "write_audio", () => writeFileSync(out, audio));
  console.log(out);

  if (args.play) {
    const status = measureLatency(latencyProfile, "play", () => playAudio(out));
    printLatencyProfile(latencyProfile, { provider: mode, success: status === 0, play: true });
    process.exit(status);
  }
}

async function speakWithGenericEndpoint({ args, baseURL, endpoint, text, latencyProfile }) {
  const payload = {
    text,
    ...(args.profile ? { profile: args.profile } : {}),
    ...(args["profile-id"] ? { profile_id: args["profile-id"] } : {}),
    ...(args.language ? { language: args.language } : {}),
    ...(args.personality ? { personality: true } : {}),
  };

  const response = await measureLatency(latencyProfile, "generic_request", () => request(`${baseURL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }));

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    console.log(JSON.stringify(await measureLatency(latencyProfile, "parse_json_response", () => response.json()), null, 2));
  } else {
    console.log(await measureLatency(latencyProfile, "read_text_response", () => response.text()));
  }
}

async function request(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new Error(`unable to connect to ${safeURLForLog(url)}: ${error.message}`);
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} (${safeURLForLog(url)})`);
  }

  return response;
}

function safeURLForLog(url) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return String(url).replace(/[?#].*$/, "?[redacted]");
  }
}

function parseArgs(argv) {
  const result = {};
  const booleanFlags = new Set(["--personality", "--play", "--list-voices", "--profile-latency"]);
  const valueFlags = new Set([
    "--url",
    "--mode",
    "--endpoint",
    "--text",
    "--speaker",
    "--speaker-id",
    "--profile",
    "--profile-id",
    "--language",
    "--speed",
    "--pitch",
    "--intonation",
    "--out",
  ]);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (booleanFlags.has(arg)) {
      result[arg.slice(2)] = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }

    if (!valueFlags.has(arg)) {
      throw new Error(`Unknown option: ${arg}`);
    }

    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value == null || booleanFlags.has(value) || valueFlags.has(value)) {
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
    const command = windowsPowerShellCommand();
    if (!command) {
      console.error("tts-voicebox: PowerShell was not found");
      return 1;
    }
    const escaped = path.replaceAll("'", "''");
    const script = `$p = New-Object System.Media.SoundPlayer '${escaped}'; $p.PlaySync()`;
    return spawnSync(command, ["-NoProfile", "-Command", script], { stdio: "inherit" }).status ?? 1;
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

  console.error(`tts-voicebox: no audio player found for ${process.platform}`);
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

export { main, parseArgs, safeURLForLog };
