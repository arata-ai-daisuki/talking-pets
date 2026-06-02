#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { performance } from "node:perf_hooks";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { windowsPowerShellCommand } from "./audio-platform.mjs";

const scriptPath = fileURLToPath(import.meta.url);

const KOKORO_VOICES = {
  af_heart: { name: "Heart", language: "en-us", gender: "Female", targetQuality: "A", overallGrade: "A" },
  af_alloy: { name: "Alloy", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "C" },
  af_aoede: { name: "Aoede", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "C+" },
  af_bella: { name: "Bella", language: "en-us", gender: "Female", targetQuality: "A", overallGrade: "A-" },
  af_jessica: { name: "Jessica", language: "en-us", gender: "Female", targetQuality: "C", overallGrade: "D" },
  af_kore: { name: "Kore", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "C+" },
  af_nicole: { name: "Nicole", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "B-" },
  af_nova: { name: "Nova", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "C" },
  af_river: { name: "River", language: "en-us", gender: "Female", targetQuality: "C", overallGrade: "D" },
  af_sarah: { name: "Sarah", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "C+" },
  af_sky: { name: "Sky", language: "en-us", gender: "Female", targetQuality: "B", overallGrade: "C-" },
  am_adam: { name: "Adam", language: "en-us", gender: "Male", targetQuality: "D", overallGrade: "F+" },
  am_echo: { name: "Echo", language: "en-us", gender: "Male", targetQuality: "C", overallGrade: "D" },
  am_eric: { name: "Eric", language: "en-us", gender: "Male", targetQuality: "C", overallGrade: "D" },
  am_fenrir: { name: "Fenrir", language: "en-us", gender: "Male", targetQuality: "B", overallGrade: "C+" },
  am_liam: { name: "Liam", language: "en-us", gender: "Male", targetQuality: "C", overallGrade: "D" },
  am_michael: { name: "Michael", language: "en-us", gender: "Male", targetQuality: "B", overallGrade: "C+" },
  am_onyx: { name: "Onyx", language: "en-us", gender: "Male", targetQuality: "C", overallGrade: "D" },
  am_puck: { name: "Puck", language: "en-us", gender: "Male", targetQuality: "B", overallGrade: "C+" },
  am_santa: { name: "Santa", language: "en-us", gender: "Male", targetQuality: "C", overallGrade: "D-" },
  bf_emma: { name: "Emma", language: "en-gb", gender: "Female", targetQuality: "B", overallGrade: "B-" },
  bf_isabella: { name: "Isabella", language: "en-gb", gender: "Female", targetQuality: "B", overallGrade: "C" },
  bf_alice: { name: "Alice", language: "en-gb", gender: "Female", targetQuality: "C", overallGrade: "D" },
  bf_lily: { name: "Lily", language: "en-gb", gender: "Female", targetQuality: "C", overallGrade: "D" },
  bm_george: { name: "George", language: "en-gb", gender: "Male", targetQuality: "B", overallGrade: "C" },
  bm_lewis: { name: "Lewis", language: "en-gb", gender: "Male", targetQuality: "C", overallGrade: "D+" },
  bm_daniel: { name: "Daniel", language: "en-gb", gender: "Male", targetQuality: "C", overallGrade: "D" },
  bm_fable: { name: "Fable", language: "en-gb", gender: "Male", targetQuality: "B", overallGrade: "C" },
};

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const latencyProfile = startLatencyProfile(args["profile-latency"]);

  if (args["list-voices"]) {
    console.log(JSON.stringify(KOKORO_VOICES, null, 2));
    printLatencyProfile(latencyProfile, { provider: "kokoro", listVoices: true });
    return;
  }

  const model = args.model ?? process.env.KOKORO_MODEL ?? "onnx-community/Kokoro-82M-v1.0-ONNX";
  const voice = args.voice ?? process.env.KOKORO_VOICE ?? "af_heart";
  const dtype = args.dtype ?? process.env.KOKORO_DTYPE ?? "q8";
  const device = args.device ?? process.env.KOKORO_DEVICE ?? "cpu";
  const cacheDir =
    args.cache ??
    process.env.TALKING_PETS_TTS_CACHE ??
    join(homedir(), ".cache", "talking-pets", "transformers");

  await measureLatency(latencyProfile, "prepare_cache", async () => {
    mkdirSync(cacheDir, { recursive: true });
    const { env } = await import("@huggingface/transformers");
    env.cacheDir = cacheDir;
  });

  const { KokoroTTS } = await measureLatency(latencyProfile, "import_kokoro", () => import("kokoro-js"));
  const tts = await measureLatency(latencyProfile, "load_model", () => KokoroTTS.from_pretrained(model, { dtype, device }));

  const text = args.text ?? (await measureLatency(latencyProfile, "read_stdin", () => readStdin()));
  if (text.trim().length === 0) {
    printLatencyProfile(latencyProfile, { provider: "kokoro", success: false, reason: "empty_text" });
    throw Object.assign(new Error("text is empty"), { exitCode: 2 });
  }

  const out = args.out ?? join(mkdtempSync(join(tmpdir(), "talking-pets-kokoro-")), "speech.wav");
  const audio = await measureLatency(latencyProfile, "generate", () => tts.generate(text, { voice }));
  await measureLatency(latencyProfile, "save", () => audio.save(out));

  console.log(out);

  if (args.play) {
    const status = measureLatency(latencyProfile, "play", () => playAudio(out));
    printLatencyProfile(latencyProfile, { provider: "kokoro", success: status === 0, play: true });
    process.exit(status);
  }
  printLatencyProfile(latencyProfile, { provider: "kokoro", success: true, play: false });
}

if (process.argv[1] === scriptPath) {
  main().catch(error => {
    console.error(`tts-kokoro: ${error?.message ?? String(error)}`);
    process.exit(error?.exitCode ?? 1);
  });
}

function parseArgs(argv) {
  const result = {};
  const booleanFlags = new Set(["--play", "--list-voices", "--profile-latency"]);
  const valueFlags = new Set(["--model", "--voice", "--dtype", "--device", "--cache", "--text", "--out"]);
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
      console.error("tts-kokoro: PowerShell was not found");
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

  console.error(`tts-kokoro: no audio player found for ${process.platform}`);
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

export { KOKORO_VOICES, main, parseArgs };
