#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { commandExists, windowsPowerShellCommand } from "./audio-platform.mjs";

const scriptPath = fileURLToPath(import.meta.url);

function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`audio path: ${error.message}`);
    process.exit(2);
  }

  const result = checkAudioPath(process.platform);

  for (const line of result.lines) {
    console.log(line);
  }

  if (options.strict && !result.ok) {
    process.exit(1);
  }
}

if (process.argv[1] === scriptPath) {
  main();
}

function checkAudioPath(platform) {
  if (platform === "darwin") {
    const afplay = existsSync("/usr/bin/afplay");
    const say = existsSync("/usr/bin/say");
    return {
      ok: afplay && say,
      lines: [
        line(afplay, "macOS afplay", "needed for generated WAV playback"),
        line(say, "macOS say", "needed for OS speech fallback"),
      ],
    };
  }

  if (platform === "win32") {
    const powershellCommand = windowsPowerShellCommand();
    const powershell = Boolean(powershellCommand);
    const systemSpeech = powershell && canLoadSystemSpeech();
    return {
      ok: powershell && systemSpeech,
      lines: [
        line(powershell, "PowerShell", powershellCommand ?? "needed for WAV playback and OS speech fallback"),
        line(systemSpeech, "System.Speech", "needed for Windows OS speech fallback"),
      ],
    };
  }

  const players = ["aplay", "paplay", "ffplay"];
  const availablePlayers = players.filter(commandExists);
  const espeak = commandExists("espeak");
  return {
    ok: availablePlayers.length > 0 || espeak,
    lines: [
      line(availablePlayers.length > 0, "Linux WAV player", availablePlayers.length ? availablePlayers.join(", ") : "install aplay, paplay, or ffplay"),
      line(espeak, "Linux espeak", "needed for OS speech fallback"),
    ],
  };
}

function line(ok, label, detail) {
  return `[${ok ? "ok" : "warn"}] ${label}: ${detail}`;
}

function canLoadSystemSpeech() {
  const command = windowsPowerShellCommand();
  if (!command) return false;
  const result = spawnSync(command, [
    "-NoProfile",
    "-Command",
    "Add-Type -AssemblyName System.Speech",
  ], { stdio: "ignore" });
  return result.status === 0;
}

function parseArgs(argv) {
  const result = { strict: false };
  for (const arg of argv) {
    if (arg === "--strict") result.strict = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/check-audio-path.mjs [--strict]");
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return result;
}

export { checkAudioPath, main, parseArgs };
