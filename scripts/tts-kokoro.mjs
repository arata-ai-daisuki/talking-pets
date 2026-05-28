#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { env } from "@huggingface/transformers";

const args = parseArgs(process.argv.slice(2));

const model = args.model ?? process.env.KOKORO_MODEL ?? "onnx-community/Kokoro-82M-v1.0-ONNX";
const voice = args.voice ?? process.env.KOKORO_VOICE ?? "af_heart";
const dtype = args.dtype ?? process.env.KOKORO_DTYPE ?? "q8";
const device = args.device ?? process.env.KOKORO_DEVICE ?? "cpu";
const cacheDir =
  args.cache ??
  process.env.TALKING_PETS_TTS_CACHE ??
  join(homedir(), ".cache", "talking-pets", "transformers");

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

try {
  if (args["list-voices"]) {
    console.log(JSON.stringify(KOKORO_VOICES, null, 2));
    process.exit(0);
  }

  mkdirSync(cacheDir, { recursive: true });
  env.cacheDir = cacheDir;

  const { KokoroTTS } = await import("kokoro-js");
  const tts = await KokoroTTS.from_pretrained(model, { dtype, device });

  const text = args.text ?? (await readStdin());
  if (text.trim().length === 0) {
    console.error("tts-kokoro: text is empty");
    process.exit(2);
  }

  const out = args.out ?? join(mkdtempSync(join(tmpdir(), "talking-pets-kokoro-")), "speech.wav");
  const audio = await tts.generate(text, { voice });
  await audio.save(out);

  console.log(out);

  if (args.play) {
    process.exit(playAudio(out));
  }
} catch (error) {
  const message = error?.message ?? String(error);
  console.error(`tts-kokoro: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--play" || arg === "--list-voices") {
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
