#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { latencyAudioFields, setLatencyAudioDurationFromWav } from "./wav-duration.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const BUILT_IN_VOICES = Object.freeze(["alloy", "ash", "ballad", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer", "verse", "marin", "cedar"]);

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const latencyProfile = startLatencyProfile(args["profile-latency"]);
  const baseURL = (args.url ?? process.env.OPENAI_TTS_API_URL ?? "https://api.openai.com").replace(/\/$/, "");
  const model = args.model ?? process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts";
  const voice = args.voice ?? process.env.OPENAI_TTS_VOICE ?? "alloy";
  const format = args.format ?? process.env.OPENAI_TTS_FORMAT ?? "wav";

  if (args["list-voices"]) {
    console.log(JSON.stringify({ provider: "openai-tts-api", voices: BUILT_IN_VOICES }, null, 2));
    return;
  }

  if (args["dry-run"]) {
    printDryRun({ baseURL, model, voice, format, apiOptIn: Boolean(args["api-opt-in"]) });
    return;
  }

  requireApiOptIn(args);
  const apiKey = requireApiKey(process.env.OPENAI_API_KEY);

  const text = args.text ?? await measureLatency(latencyProfile, "read_stdin", () => readStdin());
  if (text.trim().length === 0) {
    printLatencyProfile(latencyProfile, { provider: "openai-tts-api", success: false, reason: "empty_text" });
    throw Object.assign(new Error("text is empty"), { exitCode: 2 });
  }

  const out = await measureLatency(latencyProfile, "synthesis", () => synthesize({
    args,
    baseURL,
    apiKey,
    model,
    voice,
    format,
    text,
    latencyProfile,
  }));
  console.log(out);

  if (args.play) {
    const status = measureLatency(latencyProfile, "play", () => playAudio(out));
    printLatencyProfile(latencyProfile, { provider: "openai-tts-api", success: status === 0, play: true });
    process.exit(status);
  }

  printLatencyProfile(latencyProfile, { provider: "openai-tts-api", success: true, play: false });
}

if (process.argv[1] === scriptPath) {
  main().catch(error => {
    console.error(`tts-openai-api: ${error?.message ?? String(error)}`);
    process.exit(error?.exitCode ?? 1);
  });
}

async function synthesize({ args, baseURL, apiKey, model, voice, format, text, latencyProfile }) {
  const payload = {
    model,
    input: text,
    voice,
    response_format: format,
  };
  if (args.instructions) payload.instructions = args.instructions;
  if (args.speed) payload.speed = Number(args.speed);

  const response = await request(`${baseURL}/v1/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const audio = Buffer.from(await measureLatency(latencyProfile, "read_audio", () => response.arrayBuffer()));
  const out = args.out ?? join(mkdtempSync(join(tmpdir(), "talking-pets-openai-api-")), `speech.${format}`);
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
    throw new Error(`${response.status} ${response.statusText} ${redactCredentials(body)} (${safeURLForLog(url)})`.trim());
  }

  return response;
}

function parseArgs(argv) {
  const result = {};
  const booleanFlags = new Set(["--api-opt-in", "--dry-run", "--list-voices", "--play", "--profile-latency"]);
  const valueFlags = new Set(["--url", "--text", "--model", "--voice", "--format", "--instructions", "--speed", "--out"]);

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

function requireApiOptIn(args) {
  if (args["api-opt-in"]) return;
  throw Object.assign(new Error("remote OpenAI TTS is disabled; pass --api-opt-in after confirming text will leave this machine and API billing may apply"), { exitCode: 2 });
}

function requireApiKey(value) {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  throw Object.assign(new Error("OPENAI_API_KEY is required for remote OpenAI TTS and must be provided via environment, not preferences or docs"), { exitCode: 2 });
}

function printDryRun({ baseURL, model, voice, format, apiOptIn }) {
  console.log(JSON.stringify({
    provider: "openai-tts-api",
    dryRun: true,
    apiOptIn,
    sendsTextOffMachine: true,
    requiresApiKeyEnv: "OPENAI_API_KEY",
    billingMayApply: true,
    endpoint: `${safeURLForLog(baseURL)}/v1/audio/speech`,
    model,
    voice,
    responseFormat: format,
  }, null, 2));
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

function redactCredentials(text) {
  return String(text ?? "")
    .replace(/sk-[A-Za-z0-9_-]+/g, "<redacted credential>")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer <redacted credential>");
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
  console.error(`tts-openai-api: no audio player found for ${process.platform}`);
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

export { BUILT_IN_VOICES, parseArgs, redactCredentials, requireApiKey, requireApiOptIn, safeURLForLog };
