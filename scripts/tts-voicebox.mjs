#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join } from "node:path";

const args = parseArgs(process.argv.slice(2));
const latencyProfile = startLatencyProfile(args["profile-latency"]);
const baseURL = (args.url ?? process.env.VOICEBOX_URL ?? "http://127.0.0.1:50021").replace(/\/$/, "");
const mode = args.mode ?? process.env.VOICEBOX_MODE ?? (baseURL.includes(":50021") ? "voicevox" : "generic");
const endpoint = args.endpoint ?? process.env.VOICEBOX_ENDPOINT ?? "/speak";
const text = args.text ?? (args["list-voices"] ? "" : await readStdin());

if (args["list-voices"]) {
  await measureLatency(latencyProfile, "list_voices", () => listVoices());
  printLatencyProfile(latencyProfile, { provider: mode, success: true, listVoices: true });
  process.exit(0);
}

if (text.trim().length === 0) {
  console.error("tts-voicebox: text is empty");
  printLatencyProfile(latencyProfile, { provider: mode, success: false, reason: "empty_text" });
  process.exit(2);
}

try {
  if (mode === "voicevox") {
    await speakWithVoicevox();
  } else {
    await speakWithGenericEndpoint();
  }
  printLatencyProfile(latencyProfile, { provider: mode, success: true, play: Boolean(args.play) });
} catch (error) {
  printLatencyProfile(latencyProfile, { provider: mode, success: false });
  throw error;
}

async function listVoices() {
  const response = await request(`${baseURL}/speakers`);
  console.log(JSON.stringify(await response.json(), null, 2));
}

async function speakWithVoicevox() {
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

async function speakWithGenericEndpoint() {
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
    const body = await measureLatency(latencyProfile, "parse_json_response", () => response.json());
    console.log(JSON.stringify(body, null, 2));
  } else {
    console.log(await measureLatency(latencyProfile, "read_text_response", () => response.text()));
  }
}

async function request(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    console.error(`tts-voicebox: unable to connect to ${url}: ${error.message}`);
    process.exit(1);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error(`tts-voicebox: ${response.status} ${response.statusText} ${body}`);
    process.exit(1);
  }

  return response;
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--personality" || arg === "--play" || arg === "--list-voices" || arg === "--profile-latency") {
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
