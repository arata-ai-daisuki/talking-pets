#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { latencyAudioFields, setLatencyAudioDurationFromWav } from "./wav-duration.mjs";

const scriptPath = fileURLToPath(import.meta.url);

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const latencyProfile = startLatencyProfile(args["profile-latency"]);
  const baseURL = (args.url ?? process.env.OPENAI_COMPATIBLE_LOCAL_TTS_URL ?? "http://127.0.0.1:8089").replace(/\/$/, "");
  const model = args.model ?? process.env.OPENAI_COMPATIBLE_LOCAL_TTS_MODEL ?? "tts-1";
  const voice = args.voice ?? process.env.OPENAI_COMPATIBLE_LOCAL_TTS_VOICE ?? "default";
  const format = args.format ?? process.env.OPENAI_COMPATIBLE_LOCAL_TTS_FORMAT ?? "wav";

  assertLocalURL(baseURL);

  if (args.health) {
    await measureLatency(latencyProfile, "health", () => health(baseURL, args["health-path"] ?? "/health"));
    printLatencyProfile(latencyProfile, { provider: "openai-compatible-local", success: true, health: true });
    return;
  }

  const text = args.text ?? await measureLatency(latencyProfile, "read_stdin", () => readStdin());
  if (text.trim().length === 0) {
    printLatencyProfile(latencyProfile, { provider: "openai-compatible-local", success: false, reason: "empty_text" });
    throw Object.assign(new Error("text is empty"), { exitCode: 2 });
  }

  const out = await measureLatency(latencyProfile, "synthesis", () => synthesize({
    args,
    baseURL,
    model,
    voice,
    format,
    text,
    latencyProfile,
  }));
  console.log(out);

  if (args.play) {
    const status = measureLatency(latencyProfile, "play", () => playAudio(out));
    printLatencyProfile(latencyProfile, { provider: "openai-compatible-local", success: status === 0, play: true });
    process.exit(status);
  }

  printLatencyProfile(latencyProfile, { provider: "openai-compatible-local", success: true, play: false });
}

if (process.argv[1] === scriptPath) {
  main().catch(error => {
    console.error(`tts-openai-compatible-local: ${error?.message ?? String(error)}`);
    process.exit(error?.exitCode ?? 1);
  });
}

async function health(baseURL, healthPath) {
  const response = await request(`${baseURL}${pathWithSlash(healthPath)}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    console.log(JSON.stringify(await response.json(), null, 2));
  } else {
    console.log(await response.text());
  }
}

async function synthesize({ args, baseURL, model, voice, format, text, latencyProfile }) {
  const payload = {
    model,
    input: text,
    voice,
    response_format: format,
  };
  if (args.speed) payload.speed = Number(args.speed);

  const response = await request(`${baseURL}/v1/audio/speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const audio = Buffer.from(await measureLatency(latencyProfile, "read_audio", () => response.arrayBuffer()));
  const out = args.out ?? join(mkdtempSync(join(tmpdir(), "talking-pets-openai-local-")), `speech.${format}`);
  measureLatency(latencyProfile, "write_audio", () => writeFileSync(out, audio));
  if (format === "wav") setLatencyAudioDurationFromWav(latencyProfile, audio);
  return out;
}

async function request(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new Error(`unable to connect to ${safeURLForLog(url)}: ${error.message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`${response.status} ${response.statusText} ${body} (${safeURLForLog(url)})`.trim());
  }

  return response;
}

function parseArgs(argv) {
  const result = {};
  const booleanFlags = new Set(["--health", "--play", "--profile-latency"]);
  const valueFlags = new Set(["--url", "--health-path", "--text", "--model", "--voice", "--format", "--speed", "--out"]);

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (booleanFlags.has(arg)) {
      result[arg.slice(2)] = true;
      continue;
    }
    if (!arg.startsWith("--")) throw Object.assign(new Error(`Unexpected positional argument: ${arg}`), { exitCode: 2 });
    if (!valueFlags.has(arg)) throw Object.assign(new Error(`Unknown option: ${arg}`), { exitCode: 2 });

    const value = argv[i + 1];
    if (value == null || booleanFlags.has(value) || valueFlags.has(value)) {
      throw Object.assign(new Error(`${arg} requires a value`), { exitCode: 2 });
    }
    result[arg.slice(2)] = value;
    i += 1;
  }

  return result;
}

function assertLocalURL(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw Object.assign(new Error(`invalid local URL: ${url}`), { exitCode: 2 });
  }

  const hostname = parsed.hostname.toLowerCase();
  const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
  if (!localHosts.has(hostname)) {
    throw Object.assign(new Error("openai-compatible-local only accepts localhost URLs; use a separate API opt-in provider for remote endpoints"), { exitCode: 2 });
  }
}

function pathWithSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
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
  const steps = profile.steps.map(step => `${step.name}=${step.ms.toFixed(1)}ms`).join(" ");
  const metadata = Object.entries({ ...latencyAudioFields(profile), ...fields }).map(([key, value]) => `${key}=${value}`).join(" ");
  console.error(`[latency] total=${totalMs.toFixed(1)}ms ${steps} ${metadata}`.trim());
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
    if (result.status === 0) return 0;
    if (result.error?.code !== "ENOENT") return result.status ?? 1;
  }
  console.error(`tts-openai-compatible-local: no audio player found for ${process.platform}`);
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

export { assertLocalURL, parseArgs, safeURLForLog };
