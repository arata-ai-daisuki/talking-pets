#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import { sanitizePublicOutput } from "./sanitize-public-output.mjs";

const scriptPath = fileURLToPath(import.meta.url);

const sample = [
  "[source] private",
  "path /Users/example/.codex/state_5.sqlite",
  "cache metadata.sqlite3",
  "public fixture test/fixtures/assistant-rollout.jsonl",
  "private fixture test/fixtures/private-rollout.jsonl",
  "private rollout /Users/example/.codex/sessions/private-rollout.jsonl",
  'TALKING_PETS_VOICEVOX_URL="https://private.example/api?token=x"',
  "TALKING_PETS_VOICEBOX_URL=https://private-unquoted.example/api?token=x",
  'OPENAI_API_KEY="sk-private"',
  "ACCESS_TOKEN=secret-token",
  "Authorization: Bearer secret-header",
  "X-Api-Key: private-header",
  "LOCAL_PASSWORD='private-password'",
  "SPACE_PASSWORD=private password with spaces",
  "TALKING_PETS_SAY_VOICE=Private Voice Name",
  "recording /Users/example/Desktop/private-demo.mp4",
  "mov recording private-demo.mov",
  "archive /Users/example/Desktop/talking-pets-release.zip",
  "metadata /Users/example/Desktop/.DS_Store",
  'space recording "/Users/Jane Doe/Desktop/private demo.mov"',
  'space rollout "/Users/Jane Doe/.codex/sessions/private rollout.jsonl"',
].join("\n");

const requiredText = [
  "[source] <redacted conversation text>",
  "<redacted state DB>",
  "public fixture test/fixtures/assistant-rollout.jsonl",
  "<redacted rollout JSONL>",
  'TALKING_PETS_VOICEVOX_URL="<redacted>"',
  "TALKING_PETS_VOICEBOX_URL=<redacted>",
  "OPENAI_API_KEY=<redacted credential>",
  "ACCESS_TOKEN=<redacted credential>",
  "Authorization: <redacted credential>",
  "X-Api-Key: <redacted credential>",
  "LOCAL_PASSWORD=<redacted credential>",
  "SPACE_PASSWORD=<redacted credential>",
  "TALKING_PETS_SAY_VOICE=<redacted>",
  "<redacted artifact>",
];

const forbiddenText = [
  "private.example",
  "private-unquoted.example",
  "sk-private",
  "secret-token",
  "secret-header",
  "private-header",
  "private-password",
  "private password with spaces",
  "Private Voice Name",
  "private-rollout.jsonl",
  "metadata.sqlite3",
  "private-demo.mp4",
  "private-demo.mov",
  "Jane Doe",
  "private demo.mov",
  "private rollout.jsonl",
  "talking-pets-release.zip",
  ".DS_Store",
];

function main() {
  const sanitized = sanitizePublicOutput(sample);
  const issues = sanitizerIssues(sanitized);
  if (issues.length > 0) {
    for (const issue of issues) console.error(`[fail] ${issue}`);
    process.exit(1);
  }
  console.log("public output sanitizer: ok");
}

if (process.argv[1] === scriptPath) {
  main();
}

function sanitizerIssues(sanitized) {
  const issues = [];
  for (const text of requiredText) {
    if (!sanitized.includes(text)) issues.push(`sanitized output missing ${text}`);
  }
  for (const text of forbiddenText) {
    if (sanitized.includes(text)) issues.push(`sanitized output leaked ${text}`);
  }
  return issues;
}

export { forbiddenText, requiredText, sample, sanitizerIssues };
