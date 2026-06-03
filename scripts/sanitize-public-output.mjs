#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const publicFixtureRollouts = [
  "test/fixtures/assistant-rollout.jsonl",
  "test/fixtures/mixed-ja-en-rollout.jsonl",
  "test/fixtures/ko-zh-rollout.jsonl",
  "test/fixtures/ja-rollout.jsonl",
  "test/fixtures/en-rollout.jsonl",
  "test/fixtures/ko-rollout.jsonl",
  "test/fixtures/zh-rollout.jsonl",
  "test/fixtures/zh-traditional-rollout.jsonl",
  "test/fixtures/symbol-only-rollout.jsonl",
];

function main(argv = process.argv.slice(2), input = null) {
  let text = input;
  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return;
  }
  const extraArgs = argv.filter(arg => arg !== "--");
  if (extraArgs.length > 1) throw new Error("expected zero or one input file");
  if (text == null) {
    text = extraArgs.length === 1 ? readFileSync(extraArgs[0], "utf8") : readFileSync(0, "utf8");
  }
  process.stdout.write(sanitizePublicOutput(text));
}

if (process.argv[1] === scriptPath) {
  try {
    main();
  } catch (error) {
    console.error(`sanitize public output: ${error.message}`);
    process.exit(1);
  }
}

function sanitizePublicOutput(text) {
  return restorePublicFixtureRollouts(String(text)
    .replace(publicFixtureRolloutPattern(), (_, fixture) => publicFixtureToken(fixture))
    .replace(/(TALKING_PETS_[A-Z0-9_]+)="[^"\r\n]*"/g, '$1="<redacted>"')
    .replace(/(TALKING_PETS_[A-Z0-9_]+)='[^'\r\n]*'/g, "$1='<redacted>'")
    .replace(/(TALKING_PETS_[A-Z0-9_]+=)(?!["'])[^\r\n]*/g, "$1<redacted>")
    .replace(/\b([A-Z0-9_]*(?:API[_-]?KEY|TOKEN|SECRET|PASSWORD|CREDENTIALS?)[A-Z0-9_]*)=(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\r\n]+)/gi, "$1=<redacted credential>")
    .replace(/\b(Authorization|X-Api-Key|Api-Key)\s*:\s*(?:Bearer\s+)?[^\s\r\n]+/gi, "$1: <redacted credential>")
    .replace(/(\[source\]) .*/g, "$1 <redacted conversation text>")
    .replace(/(\[pet\]) .*/g, "$1 <redacted spoken text>")
    .replace(/\bhttps?:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::\d+)?[^\s)]*/g, url => stripURLQuery(url))
    .replace(/\bhttps?:\/\/[^\s)]*/g, "<redacted endpoint>")
    .replace(/(["'`])(?:[A-Za-z]:\\Users\\|\/(?:Users|home)\/|\/private\/var\/folders\/|(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\])[^"'`\r\n]*state_5\.sqlite\b\1/g, "$1<redacted state DB>$1")
    .replace(/(["'`])(?:[A-Za-z]:\\|\/|(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\])[^"'`\r\n]*rollout[^"'`\r\n]*\.jsonl\b\1/g, "$1<redacted rollout JSONL>$1")
    .replace(/(["'`])(?:[A-Za-z]:\\|\/|(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\])[^"'`\r\n]+(?:\.(?:wav|mp3|m4a|aac|flac|ogg|oga|opus|mp4|webm|mkv|mov|sqlite|sqlite3|db|onnx|safetensors|gguf|zip|tgz|tar|tar\.gz)|\.DS_Store)\b\1/gi, "$1<redacted artifact>$1")
    .replace(/(["'`])(?:[A-Za-z]:\\Users\\|\/(?:Users|home)\/|\/private\/var\/folders\/|(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\])[^"'`\r\n]+\1/g, "$1<redacted path>$1")
    .replace(/\b[A-Za-z]:\\Users\\[^ \r\n]*state_5\.sqlite\b/g, "<redacted state DB>")
    .replace(/\/(?:Users|home)\/[^ \r\n]*state_5\.sqlite\b/g, "<redacted state DB>")
    .replace(/\/private\/var\/folders\/[^ \r\n]*state_5\.sqlite\b/g, "<redacted state DB>")
    .replace(/(?:~|\$HOME|\${HOME}|%USERPROFILE%)\/[^ \r\n]*state_5\.sqlite\b/g, "<redacted state DB>")
    .replace(/%USERPROFILE%\\[^ \r\n]*state_5\.sqlite\b/g, "<redacted state DB>")
    .replace(/(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\][^ \r\n]*rollout[^ \r\n]*\.jsonl\b/g, "<redacted rollout JSONL>")
    .replace(/(^|[\s])(?:[A-Za-z]:\\|\/)[^ \r\n]*rollout[^ \r\n]*\.jsonl\b/g, "$1<redacted rollout JSONL>")
    .replace(/(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\][^ \r\n]+(?:\.(?:wav|mp3|m4a|aac|flac|ogg|oga|opus|mp4|webm|mkv|mov|sqlite|sqlite3|db|onnx|safetensors|gguf|zip|tgz|tar|tar\.gz)|\.DS_Store)\b/gi, "<redacted artifact>")
    .replace(/(^|[\s])(?:[A-Za-z]:\\|\/)[^ \r\n]+(?:\.(?:wav|mp3|m4a|aac|flac|ogg|oga|opus|mp4|webm|mkv|mov|sqlite|sqlite3|db|onnx|safetensors|gguf|zip|tgz|tar|tar\.gz)|\.DS_Store)\b/gi, "$1<redacted artifact>")
    .replace(/[^\s]*rollout[^\s]*\.jsonl\b/g, "<redacted rollout JSONL>")
    .replace(/\b[^\s]+(?:\.(?:wav|mp3|m4a|aac|flac|ogg|oga|opus|mp4|webm|mkv|mov|sqlite|sqlite3|db|onnx|safetensors|gguf|zip|tgz|tar|tar\.gz)|\.DS_Store)\b/gi, "<redacted artifact>")
    .replace(/(^|[\s])\.DS_Store\b/g, "$1<redacted artifact>")
    .replace(/\b[A-Za-z]:\\Users\\[^ \r\n]+/g, "<redacted path>")
    .replace(/\/(?:Users|home)\/[^ \r\n]+/g, "<redacted path>")
    .replace(/\/private\/var\/folders\/[^ \r\n]+/g, "<redacted path>")
    .replace(/(?:~|\$HOME|\${HOME}|%USERPROFILE%)[/\\][^ \r\n]+/g, "<redacted path>")
    .replace(/\bstate_5\.sqlite\b/g, "<redacted state DB>"));
}

function publicFixtureRolloutPattern() {
  return new RegExp(`\\b(${publicFixtureRollouts.map(escapeRegExp).join("|")})\\b`, "g");
}

function publicFixtureToken(fixture) {
  return `__TALKING_PETS_PUBLIC_FIXTURE_${publicFixtureRollouts.indexOf(fixture)}__`;
}

function restorePublicFixtureRollouts(text) {
  return publicFixtureRollouts.reduce(
    (result, fixture, index) => result.replaceAll(`__TALKING_PETS_PUBLIC_FIXTURE_${index}__`, fixture),
    text,
  );
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripURLQuery(url) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return url.replace(/[?#].*$/, "");
  }
}

function printUsage() {
  console.log("Usage: node scripts/sanitize-public-output.mjs [input-file]");
  console.log("Reads stdin when no input file is provided.");
}

export { main, sanitizePublicOutput, stripURLQuery };
