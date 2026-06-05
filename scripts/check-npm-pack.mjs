#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, normalize } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { documentAnchors, documentLinks, shouldSkip, splitTarget } from "./check-markdown-links.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const maxPackageSize = 600_000;
const maxEntryCount = 67;
const publicFixtureRollouts = new Set([
  "test/fixtures/assistant-rollout.jsonl",
  "test/fixtures/mixed-ja-en-rollout.jsonl",
  "test/fixtures/ko-zh-rollout.jsonl",
]);

const requiredPaths = [
  ".talking-pets.local.env.example",
  "README.md",
  "README.en.md",
  "LICENSE",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "CREDITS.md",
  "FUTURE_PLAN.md",
  "SECURITY.md",
  "assets/demo-preview.png",
  "check.command",
  "check.ps1",
  "check.sh",
  "demo/index.html",
  "docs/demo/talking-pets-overlay-2026-05-28-frame.png",
  "docs/public-repo-review-checklist.md",
  "docs/real-device-verification.md",
  "docs/release-notes-template.md",
  "docs/verification-status.md",
  "install.command",
  "install.ps1",
  "install.sh",
  "package.json",
  "presets/examples/en-kokoro-heart.env",
  "presets/examples/generic-voicebox.env",
  "presets/examples/ja-voicevox-zundamon.env",
  "presets/examples/ko-say-fallback.env",
  "presets/examples/privacy-first-say.env",
  "presets/examples/zh-say-fallback.env",
  "presets/speech-style.json",
  "presets/voices.json",
  "scripts/audio-platform.mjs",
  "scripts/check-audio-path.mjs",
  "scripts/check-codex-compat.mjs",
  "scripts/check-config-files.mjs",
  "scripts/check-installer-configs.mjs",
  "scripts/check-markdown-links.mjs",
  "scripts/check-node-runtime.mjs",
  "scripts/check-npm-pack.mjs",
  "scripts/check-platform-scripts.mjs",
  "scripts/check-public-output-sanitizer.mjs",
  "scripts/check-release-readiness.mjs",
  "scripts/check-swift-cli.mjs",
  "scripts/sanitize-public-output.mjs",
  "scripts/pet-rollout-monitor-node.command",
  "scripts/pet-rollout-monitor.command",
  "scripts/pet-rollout-monitor.mjs",
  "scripts/pet-rollout-monitor.swift",
  "scripts/tts-kokoro.mjs",
  "scripts/tts-voicebox.mjs",
  "scripts/tts-melotts.mjs",
  "src/talking-pet-mvp.js",
  "start-selected-tts.command",
  "start-selected-tts.ps1",
  "start-selected-tts.sh",
  "test/fixtures/assistant-rollout.jsonl",
  "test/fixtures/mixed-ja-en-rollout.jsonl",
  "test/fixtures/ko-zh-rollout.jsonl",
];

const executablePaths = [
  "check.command",
  "check.sh",
  "install.command",
  "install.sh",
  "scripts/pet-rollout-monitor-node.command",
  "scripts/pet-rollout-monitor.command",
  "start-selected-tts.command",
  "start-selected-tts.sh",
];

const forbiddenPatterns = [
  { label: "GitHub metadata", test: path => path.startsWith(".github/") },
  { label: "tests", test: path => path.startsWith("test/") && !publicFixtureRollouts.has(path) },
  { label: "implementation notes", test: path => path === "implementation-notes.md" },
  { label: "demo video", test: path => path.endsWith(".mov") },
  { label: "stale SVG preview", test: path => path === "assets/demo-preview.svg" },
  { label: "macOS metadata", test: path => path === ".DS_Store" || path.endsWith("/.DS_Store") },
  { label: "local config", test: path => path === ".talking-pets.local.env" },
  { label: "local env file", test: path => isForbiddenEnvFile(path) },
  { label: "private rollout JSONL", test: path => path.endsWith(".jsonl") && !publicFixtureRollouts.has(path) },
  { label: "SQLite DB", test: path => /\.(sqlite|sqlite3|db)$/i.test(path) },
  { label: "generated audio", test: path => /\.(wav|mp3|m4a|aac|flac|ogg|oga|opus)$/i.test(path) },
  { label: "local recording", test: path => /\.(mp4|webm|mkv)$/i.test(path) },
  { label: "local archive", test: path => /\.(zip|tgz|tar|tar\.gz)$/i.test(path) },
  { label: "model file", test: path => /\.(onnx|safetensors|gguf)$/i.test(path) },
  { label: "local log", test: path => path.endsWith(".log") },
  { label: "temporary file", test: path => path.endsWith(".tmp") },
  { label: "local experimental folder", test: path => path === "local-experimental" || path.startsWith("local-experimental/") },
  { label: "dependency folder", test: path => path === "node_modules" || path.startsWith("node_modules/") },
];

function main() {
  const cacheDir = mkdtempSync(join(tmpdir(), "talking-pets-npm-cache-"));
  try {
    const command = npmCommand();
    const result = spawnSync(command, ["--cache", cacheDir, "pack", "--dry-run", "--json"], {
      encoding: "utf8",
      shell: shouldUseShellForNPM(),
    });
    if (result.error) fail(`npm pack failed to start: ${result.error.code ?? result.error.message}`);
    if (result.status !== 0) {
      fail(`npm pack exited ${result.status ?? result.signal ?? "unknown"}\n${result.stderr || result.stdout}`);
    }

    let pack;
    try {
      pack = JSON.parse(result.stdout)[0];
    } catch (error) {
      fail(`npm pack did not return parseable JSON: ${error.message}`);
    }

    const issues = packIssues(pack, { checkExecutableMode: shouldCheckExecutableMode() });
    if (issues.length > 0) {
      for (const issue of issues) console.error(`[fail] ${issue}`);
      process.exit(1);
    }
    console.log(`npm pack scope: ok (${pack.entryCount} files, ${pack.size} bytes)`);
  } finally {
    rmSync(cacheDir, { recursive: true, force: true });
  }
}

if (process.argv[1] === scriptPath) {
  main();
}

function packIssues(pack, opts = {}) {
  const checkExecutableMode = opts.checkExecutableMode ?? true;
  const issues = [];
  if (!pack || !Array.isArray(pack.files)) return ["npm pack result is missing files"];
  if (pack.size > maxPackageSize) issues.push(`npm package size ${pack.size} exceeds ${maxPackageSize}`);
  if (pack.entryCount > maxEntryCount) issues.push(`npm package entry count ${pack.entryCount} exceeds ${maxEntryCount}`);

  const files = new Map(pack.files.map(file => [file.path, file]));
  for (const path of requiredPaths) {
    if (!files.has(path)) issues.push(`npm package missing required file: ${path}`);
  }

  if (checkExecutableMode) {
    for (const path of executablePaths) {
      const file = files.get(path);
      if (!file) continue;
      if ((file.mode & 0o111) === 0) issues.push(`npm package lost executable bit: ${path}`);
    }
  }

  for (const path of files.keys()) {
    const forbidden = forbiddenPatterns.find(rule => rule.test(path));
    if (forbidden) issues.push(`npm package includes forbidden ${forbidden.label}: ${path}`);
  }
  issues.push(...packageDocumentLinkIssues(files));
  return issues;
}

function packageDocumentLinkIssues(files) {
  const issues = [];
  const normalizedFiles = new Map([...files.keys()].map(path => [normalizePackagePath(path), path]));
  for (const path of files.keys()) {
    if (!path.endsWith(".md") && !path.endsWith(".html")) continue;
    let text;
    try {
      text = readFileSync(path, "utf8");
    } catch (error) {
      issues.push(`npm package document ${path} could not be read: ${error.message}`);
      continue;
    }
    for (const link of documentLinks(text)) {
      if (shouldSkip(link.target)) continue;
      const { targetPath, fragment } = splitTarget(link.target);
      if (!targetPath && !fragment) continue;
      const resolved = targetPath ? normalize(join(dirname(path), safeDecodeURIComponent(targetPath))) : path;
      const normalized = normalizePackagePath(resolved);
      if (linkEscapesPackage(targetPath, normalized) && !normalizedFiles.has(normalized)) {
        issues.push(`npm package document link escapes package: ${path}:${link.line} -> ${link.target}`);
        continue;
      }
      if (!normalizedFiles.has(normalized)) {
        issues.push(`npm package document link missing packaged target: ${path}:${link.line} -> ${link.target}`);
        continue;
      }
      if (fragment) {
        try {
          if (!documentAnchors(readFileSync(normalizedFiles.get(normalized), "utf8")).has(safeDecodeURIComponent(fragment))) {
            issues.push(`npm package document link missing packaged anchor: ${path}:${link.line} -> ${link.target}`);
          }
        } catch (error) {
          issues.push(`npm package document link target ${normalized} could not be read: ${error.message}`);
        }
      }
    }
  }
  return issues;
}

function normalizePackagePath(path) {
  return normalize(path).replace(/\\/g, "/");
}

function linkEscapesPackage(targetPath, normalized) {
  if (!targetPath) return false;
  return normalized === ".."
    || normalized.startsWith("../")
    || normalized.startsWith("/")
    || /^[A-Za-z]:\//.test(normalized)
    || safeDecodeURIComponent(targetPath).replace(/\\/g, "/").startsWith("../");
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isForbiddenEnvFile(path) {
  if (!path.endsWith(".env") && !path.includes(".env.")) return false;
  if (path === ".talking-pets.local.env.example") return false;
  if (path.startsWith("presets/examples/") && path.endsWith(".env")) return false;
  return true;
}

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function shouldUseShellForNPM(platform = process.platform) {
  return platform === "win32";
}

function shouldCheckExecutableMode(platform = process.platform) {
  return platform !== "win32";
}

function fail(message) {
  console.error(`[fail] ${message}`);
  process.exit(1);
}

export { npmCommand, packIssues, packageDocumentLinkIssues, shouldCheckExecutableMode, shouldUseShellForNPM };
