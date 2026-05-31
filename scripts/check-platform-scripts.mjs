#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { windowsPowerShellCommand } from "./audio-platform.mjs";

const scriptPath = fileURLToPath(import.meta.url);

function main() {
  const checks = platformChecks(process.platform, undefined, { includeAvailablePowerShell: true });
  for (const check of checks) {
    runCheck(check);
  }
  console.log("platform scripts: ok");
}

if (process.argv[1] === scriptPath) {
  main();
}

function platformChecks(platform, commandExists, opts = {}) {
  const checks = [];
  if (platform !== "win32") {
    checks.push({
      command: "bash",
      args: ["-n", "install.sh", "check.sh", "start-selected-tts.sh"],
      label: "bash scripts",
    });
  }
  if (platform === "darwin") {
    checks.push({
      command: "zsh",
      args: ["-n", "install.command", "check.command", "start-selected-tts.command", "scripts/pet-rollout-monitor.command", "scripts/pet-rollout-monitor-node.command"],
      label: "zsh scripts",
    });
    checks.push({
      command: "swift",
      args: ["-frontend", "-parse", "scripts/pet-rollout-monitor.swift"],
      label: "Swift monitor parse",
    });
    checks.push({
      command: process.execPath,
      args: ["scripts/check-swift-cli.mjs"],
      label: "Swift CLI errors",
    });
  }
  if (platform === "win32" || opts.includeAvailablePowerShell) {
    const powerShell = windowsPowerShellCommand(commandExists);
    if (platform === "win32" || powerShell) {
      checks.push({
        command: powerShell ?? "powershell.exe",
        args: [
          "-NoProfile",
          "-Command",
          "$parseErrors = $null; foreach ($path in @('install.ps1', 'check.ps1', 'start-selected-tts.ps1')) { $parseErrors = $null; $null = [System.Management.Automation.PSParser]::Tokenize((Get-Content -Raw $path), [ref]$parseErrors); if ($parseErrors) { $parseErrors | Format-List; exit 1 } }",
        ],
        label: platform === "win32" ? "PowerShell scripts" : "PowerShell scripts (available)",
      });
    }
  }
  return checks;
}

function runCheck(check) {
  const result = spawnSync(check.command, check.args, { encoding: "utf8" });
  if (result.error) {
    fail(`${check.label}: ${check.command} failed to start: ${result.error.code ?? result.error.message}`);
  }
  if (result.status !== 0) {
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
    fail(`${check.label}: ${check.command} exited ${result.status ?? result.signal ?? "unknown"}${output ? `\n${output}` : ""}`);
  }
  console.log(`[ok] ${check.label}`);
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}

export { main, platformChecks, runCheck };
