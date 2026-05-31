#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);

function main() {
  if (process.platform !== "darwin") {
    console.log("swift cli: skipped (macOS only)");
    return;
  }

  assertSwiftError(
    ["scripts/pet-rollout-monitor.swift", "--tts", "remote", "--once", "--dry-run", "--rollout", "test/fixtures/assistant-rollout.jsonl"],
    "--tts must be one of",
  );
  assertSwiftError(
    ["scripts/pet-rollout-monitor.swift", "--interval", "0", "--once", "--dry-run", "--rollout", "test/fixtures/assistant-rollout.jsonl"],
    "--interval must be a positive number",
  );
  assertSwiftError(
    ["scripts/pet-rollout-monitor.swift", "--speech-language", "fr", "--once", "--dry-run", "--rollout", "test/fixtures/assistant-rollout.jsonl"],
    "--speech-language must be one of: auto, ja, en, ko, zh, other",
  );
  assertSwiftError(
    ["scripts/pet-rollout-monitor.swift", "--voice", "--once", "--dry-run", "--rollout", "test/fixtures/assistant-rollout.jsonl"],
    "--voice requires a value",
  );
  assertSwiftSuccess(
    ["scripts/pet-rollout-monitor.swift", "--speech-language", "zh", "--once", "--dry-run", "--rollout", "test/fixtures/assistant-rollout.jsonl"],
    "[pet] CI dry run ready.",
  );

  console.log("swift cli: ok");
}

if (process.argv[1] === scriptPath) {
  main();
}

function assertSwiftError(args, expected) {
  const result = spawnSync("swift", args, { encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.status !== 2) {
    fail(`expected swift exit 2 for ${args.join(" ")}, got ${result.status ?? result.signal ?? "unknown"}`);
  }
  if (!output.includes(`error: ${expected}`)) {
    fail(`expected swift error to include "error: ${expected}"`);
  }
  if (output.includes("Stack dump") || output.includes("Fatal error")) {
    fail("swift CLI error output must not include a stack dump");
  }
}

function assertSwiftSuccess(args, expected) {
  const result = spawnSync("swift", args, { encoding: "utf8" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  if (result.status !== 0) {
    fail(`expected swift success for ${args.join(" ")}, got ${result.status ?? result.signal ?? "unknown"}\n${output.trim()}`);
  }
  if (!output.includes(expected)) {
    fail(`expected swift output to include "${expected}"`);
  }
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}

export { assertSwiftError, assertSwiftSuccess, main };
