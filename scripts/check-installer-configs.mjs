#!/usr/bin/env node

import { chmodSync, copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { commandExists, windowsPowerShellCommand } from "./audio-platform.mjs";
import { validateEnvText, validateEnvValues } from "./check-config-files.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = process.cwd();
const voiceboxInput = "en\n5\nhttp://127.0.0.1:8080\ngeneric\ndefault\nen\n";
const linuxSayInput = "en\n4\n";
const expectedVoiceboxEnv = {
  TALKING_PETS_UI_LANGUAGE: "en",
  TALKING_PETS_TTS: "voicebox",
  TALKING_PETS_VOICEVOX_URL: "http://127.0.0.1:8080",
  TALKING_PETS_VOICEVOX_SPEAKER: "3",
  TALKING_PETS_VOICEBOX_MODE: "generic",
  TALKING_PETS_VOICEBOX_PROFILE: "default",
  TALKING_PETS_VOICEBOX_LANGUAGE: "en",
  TALKING_PETS_KOKORO_VOICE: "af_heart",
  TALKING_PETS_SAY_VOICE: "Kyoko",
  TALKING_PETS_LANGUAGE_ROUTE: "0",
  TALKING_PETS_SPEECH_LANGUAGE: "auto",
};
const expectedSayEnv = {
  TALKING_PETS_UI_LANGUAGE: "en",
  TALKING_PETS_TTS: "say",
  TALKING_PETS_VOICEVOX_URL: "http://127.0.0.1:50021",
  TALKING_PETS_VOICEVOX_SPEAKER: "3",
  TALKING_PETS_KOKORO_VOICE: "af_heart",
  TALKING_PETS_SAY_VOICE: "Kyoko",
  TALKING_PETS_LANGUAGE_ROUTE: "0",
  TALKING_PETS_SPEECH_LANGUAGE: "auto",
};

function main() {
  const results = [
    checkMacOSInstaller(),
    checkLinuxInstaller(),
    checkPowerShellInstaller(),
  ];
  assertRequiredInstallers(results, process.platform);
  console.log("installer configs: ok");
}

if (process.argv[1] === scriptPath) {
  main();
}

function checkMacOSInstaller() {
  const label = "macOS installer";
  if (!commandExists("zsh")) {
    console.log("[skip] macOS installer config check (zsh not found)");
    return { label, status: "skipped" };
  }
  const workDir = makeWorkDir("talking-pets-install-command-");
  try {
    const installer = join(workDir, "install.command");
    copyFileSync(join(repoRoot, "install.command"), installer);
    chmodSync(installer, 0o755);
    const result = spawnSync("zsh", [installer], {
      cwd: workDir,
      input: voiceboxInput,
      encoding: "utf8",
    });
    assertRunSucceeded("macOS installer", result);
    assertInstallerOutputSafe("macOS installer", result, workDir);
    assertGeneratedEnv(workDir, expectedVoiceboxEnv, "macOS installer");
    console.log("[ok] macOS installer voicebox config");
    return { label, status: "ok" };
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

function checkLinuxInstaller() {
  const label = "Linux installer";
  if (!commandExists("bash")) {
    console.log("[skip] Linux installer config check (bash not found)");
    return { label, status: "skipped" };
  }
  checkShellInstaller({
    command: "bash",
    sourceFile: "install.sh",
    input: voiceboxInput,
    expected: expectedVoiceboxEnv,
    label: "Linux installer",
    okMessage: "Linux installer voicebox config",
  });
  checkShellInstaller({
    command: "bash",
    sourceFile: "install.sh",
    input: linuxSayInput,
    expected: expectedSayEnv,
    label: "Linux installer",
    okMessage: "Linux installer say config",
  });
  return { label, status: "ok" };
}

function checkPowerShellInstaller() {
  const label = "PowerShell installer";
  const command = windowsPowerShellCommand();
  if (!command) {
    console.log("[skip] PowerShell installer config check (PowerShell not found)");
    return { label, status: "skipped" };
  }
  checkPowerShellGeneratedConfig(command, [
    "-Tts",
    "voicebox",
    "-VoiceboxMode",
    "generic",
    "-VoicevoxUrl",
    "http://127.0.0.1:8080",
    "-VoiceboxProfile",
    "default",
    "-VoiceboxLanguage",
    "en",
  ], expectedVoiceboxEnv, "PowerShell installer", "PowerShell installer voicebox config");
  checkPowerShellGeneratedConfig(command, [
    "-Tts",
    "say",
  ], expectedSayEnv, "PowerShell installer", "PowerShell installer say config");
  return { label, status: "ok" };
}

function checkShellInstaller({ command, sourceFile, input, expected, label, okMessage }) {
  const workDir = makeWorkDir(`talking-pets-${sourceFile.replace(/[^a-z0-9]+/gi, "-")}-`);
  try {
    const installer = join(workDir, sourceFile);
    copyFileSync(join(repoRoot, sourceFile), installer);
    chmodSync(installer, 0o755);
    const result = spawnSync(command, [installer], {
      cwd: workDir,
      input,
      encoding: "utf8",
    });
    assertRunSucceeded(label, result);
    assertInstallerOutputSafe(label, result, workDir);
    assertGeneratedEnv(workDir, expected, label);
    console.log(`[ok] ${okMessage}`);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

function checkPowerShellGeneratedConfig(command, args, expected, label, okMessage) {
  const workDir = makeWorkDir("talking-pets-install-ps1-");
  try {
    copyFileSync(join(repoRoot, "install.ps1"), join(workDir, "install.ps1"));
    const result = spawnSync(command, [
      "-NoProfile",
      "-File",
      join(workDir, "install.ps1"),
      ...args,
    ], {
      cwd: workDir,
      encoding: "utf8",
    });
    assertRunSucceeded(label, result);
    assertInstallerOutputSafe(label, result, workDir);
    assertGeneratedEnv(workDir, expected, label);
    console.log(`[ok] ${okMessage}`);
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

function assertRequiredInstallers(results, platform) {
  for (const issue of requiredInstallerIssues(results, platform)) {
    fail(issue);
  }
}

function requiredInstallerIssues(results, platform = process.platform) {
  const issues = [];
  for (const label of requiredInstallerLabels(platform)) {
    const result = results.find(item => item.label === label);
    if (result?.status !== "ok") issues.push(`${label} config check is required on ${platform}`);
  }
  return issues;
}

function requiredInstallerLabels(platform = process.platform) {
  if (platform === "darwin") return ["macOS installer"];
  if (platform === "win32") return ["PowerShell installer"];
  if (platform === "linux") return ["Linux installer"];
  return [];
}

function assertRunSucceeded(label, result) {
  if (result.error) fail(`${label} failed to start: ${result.error.code ?? result.error.message}`);
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    fail(`${label} exited ${result.status ?? result.signal ?? "unknown"}${output ? `\n${output}` : ""}`);
  }
}

function assertInstallerOutputSafe(label, result, workDir) {
  const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
  for (const issue of installerOutputIssues(output, workDir, label)) {
    fail(issue);
  }
}

function installerOutputIssues(output, workDir, label = "installer") {
  const issues = [];
  if (!output.includes("Saved config: .talking-pets.local.env")) {
    issues.push(`${label} output must mention relative saved config path`);
  }
  if (output.includes(workDir)) {
    issues.push(`${label} output leaked working directory path`);
  }
  if (/Saved config: .*[\\/]\.talking-pets\.local\.env/.test(output)) {
    issues.push(`${label} output leaked absolute saved config path`);
  }
  return issues;
}

function assertGeneratedEnv(workDir, expected, label) {
  const file = join(workDir, ".talking-pets.local.env");
  if (!existsSync(file)) fail(`${label} did not generate .talking-pets.local.env`);
  const result = validateEnvText(readFileSync(file, "utf8"), `${label} generated env`);
  for (const error of result.errors) fail(error);
  for (const error of validateEnvValues(result.values, `${label} generated env`)) fail(error);
  const expectedKeys = Object.keys(expected).sort();
  const actualKeys = Object.keys(result.values).sort();
  if (actualKeys.join("\n") !== expectedKeys.join("\n")) {
    fail(`${label} generated env keys ${JSON.stringify(actualKeys)}, expected ${JSON.stringify(expectedKeys)}`);
  }
  for (const [key, value] of Object.entries(expected)) {
    if (result.values[key] !== value) {
      fail(`${label} generated ${key}=${JSON.stringify(result.values[key])}, expected ${JSON.stringify(value)}`);
    }
  }
}

function makeWorkDir(prefix) {
  return mkdtempSync(join(tmpdir(), prefix));
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}

export { assertRequiredInstallers, installerOutputIssues, requiredInstallerIssues, requiredInstallerLabels };
