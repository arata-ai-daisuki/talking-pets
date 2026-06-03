#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const scriptPath = fileURLToPath(import.meta.url);
let failures = 0;

const requiredFiles = [
  "README.md",
  "README.en.md",
  "LICENSE",
  "CREDITS.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "FUTURE_PLAN.md",
  ".gitignore",
  ".npmignore",
  "package.json",
  "package-lock.json",
  ".talking-pets.local.env.example",
  "assets/demo-preview.png",
  "check.command",
  "docs/demo/talking-pets-overlay-2026-05-28-frame.png",
  "docs/demo/talking-pets-overlay-2026-05-28.mov",
  "docs/public-repo-review-checklist.md",
  "docs/real-device-verification.md",
  "docs/release-notes-template.md",
  "docs/verification-status.md",
  ".github/pull_request_template.md",
  ".github/workflows/ci.yml",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/install_trouble.yml",
  ".github/ISSUE_TEMPLATE/platform_verification.yml",
  ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
  "presets/examples/ja-voicevox-zundamon.env",
  "presets/examples/en-kokoro-heart.env",
  "presets/examples/ko-say-fallback.env",
  "presets/examples/zh-say-fallback.env",
  "presets/examples/privacy-first-say.env",
  "presets/examples/generic-voicebox.env",
  "demo/index.html",
  "src/talking-pet-mvp.js",
  "scripts/pet-rollout-monitor.mjs",
  "scripts/pet-rollout-monitor.command",
  "scripts/pet-rollout-monitor-node.command",
  "scripts/pet-rollout-monitor.swift",
  "scripts/tts-kokoro.mjs",
  "scripts/tts-voicebox.mjs",
  "scripts/audio-platform.mjs",
  "scripts/check-audio-path.mjs",
  "scripts/check-config-files.mjs",
  "scripts/check-codex-compat.mjs",
  "scripts/check-installer-configs.mjs",
  "scripts/check-markdown-links.mjs",
  "scripts/check-node-runtime.mjs",
  "scripts/check-public-output-sanitizer.mjs",
  "scripts/check-release-readiness.mjs",
  "scripts/check-swift-cli.mjs",
  "scripts/check-platform-scripts.mjs",
  "scripts/check-npm-pack.mjs",
  "scripts/sanitize-public-output.mjs",
  "install.command",
  "install.ps1",
  "install.sh",
  "check.ps1",
  "start-selected-tts.command",
  "start-selected-tts.ps1",
  "check.sh",
  "start-selected-tts.sh",
  "test/fixtures/assistant-rollout.jsonl",
  "test/fixtures/mixed-ja-en-rollout.jsonl",
  "test/fixtures/ko-zh-rollout.jsonl",
  "test/monitor.test.mjs",
];

const executableFiles = [
  "install.command",
  "install.sh",
  "check.command",
  "start-selected-tts.command",
  "check.sh",
  "start-selected-tts.sh",
  "scripts/pet-rollout-monitor.command",
  "scripts/pet-rollout-monitor-node.command",
];

const forbiddenFiles = [
  "assets/demo-preview.svg",
];

const publicFixtureRollouts = new Set([
  "test/fixtures/assistant-rollout.jsonl",
  "test/fixtures/mixed-ja-en-rollout.jsonl",
  "test/fixtures/ko-zh-rollout.jsonl",
  "test/fixtures/ja-rollout.jsonl",
  "test/fixtures/en-rollout.jsonl",
  "test/fixtures/ko-rollout.jsonl",
  "test/fixtures/zh-rollout.jsonl",
  "test/fixtures/zh-traditional-rollout.jsonl",
  "test/fixtures/symbol-only-rollout.jsonl",
]);

const forbiddenArtifactRules = [
  { label: "local config", test: file => file === ".talking-pets.local.env" },
  { label: "local env file", test: file => isForbiddenEnvFile(file) },
  { label: "macOS metadata", test: file => file.endsWith("/.DS_Store") || file === ".DS_Store" },
  { label: "Codex state DB", test: file => file.endsWith("/state_5.sqlite") || file === "state_5.sqlite" },
  { label: "SQLite DB", test: file => /\.(sqlite|sqlite3|db)$/i.test(file) },
  { label: "private rollout JSONL", test: file => file.endsWith(".jsonl") && !publicFixtureRollouts.has(file) },
  { label: "generated audio", test: file => /\.(wav|mp3|m4a|aac|flac|ogg|oga|opus)$/i.test(file) },
  { label: "local recording", test: file => /\.(mp4|webm|mkv|mov)$/i.test(file) && file !== "docs/demo/talking-pets-overlay-2026-05-28.mov" },
  { label: "local archive", test: file => /\.(zip|tgz|tar|tar\.gz)$/i.test(file) },
  { label: "model file", test: file => /\.(onnx|safetensors|gguf)$/i.test(file) },
  { label: "local log", test: file => file.endsWith(".log") },
  { label: "temporary file", test: file => file.endsWith(".tmp") },
  { label: "local experimental folder", test: file => file === "local-experimental" || file.startsWith("local-experimental/") },
  { label: "dependency folder", test: file => file === "node_modules" || file.startsWith("node_modules/") },
];

const forbiddenPublicTextRules = [
  { label: "maintainer home path", pattern: ["", "Users", "tsukuyomi"].join("/") },
  { label: "maintainer project path", pattern: ["Documents", "Projects", "talking-pets"].join("/") },
];

const platformGraduationBoundaryChecks = [
  ["docs/real-device-verification.md", "must not be used by themselves to graduate a platform"],
  ["docs/verification-status.md", "not platform graduation evidence"],
  ["docs/release-notes-template.md", "not platform graduation evidence"],
  ["docs/public-repo-review-checklist.md", "cannot graduate Windows or Linux without audible, sanitized real-device evidence"],
  ["README.md", "Windows / Linux のexperimental解除には使わない"],
  ["README.en.md", "not evidence for graduating Windows or Linux from experimental"],
  [".github/ISSUE_TEMPLATE/platform_verification.yml", "not evidence for graduating Windows or Linux from experimental without audible, sanitized real-device output"],
  [".github/pull_request_template.md", "not Windows / Linux graduation evidence"],
  ["FUTURE_PLAN.md", "not Windows / Linux graduation evidence"],
];

const publicNpmRunReferenceFiles = [
  "README.md",
  "README.en.md",
  "CONTRIBUTING.md",
  "FUTURE_PLAN.md",
  "docs/public-repo-review-checklist.md",
  "docs/real-device-verification.md",
  "docs/release-notes-template.md",
  "docs/verification-status.md",
  ".github/ISSUE_TEMPLATE/bug_report.yml",
  ".github/ISSUE_TEMPLATE/install_trouble.yml",
  ".github/ISSUE_TEMPLATE/platform_verification.yml",
  ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
  ".github/pull_request_template.md",
];

function main() {
  failures = 0;

  for (const file of requiredFiles) {
    assertExists(file);
  }

  for (const file of executableFiles) {
    assertExecutable(file);
  }

  for (const file of forbiddenFiles) {
    assertAbsent(file);
  }

  checkForbiddenArtifacts();
  checkForbiddenPublicText();
  checkGitHubTemplates();
  checkWorkflow();
  checkPackageJSON();
  checkPackageLock();
  checkPlatformGraduationBoundaries();
  checkNonEmptyAsset("assets/demo-preview.png");
  checkTextContains("README.md", "Safety Model");
  checkTextContains("README.md", "公開レビュー可能なMVP");
  checkTextContains("README.md", "docs/real-device-verification.md");
  checkTextContains("README.md", "docs/release-notes-template.md");
  checkTextContains("README.md", "docs/verification-status.md");
  checkTextContains("README.md", "| Windows Node monitor | Experimental |");
  checkTextContains("README.md", "| Linux Node monitor | Experimental |");
  checkTextContains("README.md", "Windows / Linux 版はまだ experimental です。");
  checkTextContains("README.md", "Linux experimental:");
  checkTextContains("README.md", "aplay` / `paplay` / `ffplay");
  checkTextContains("README.md", "npm run check:config");
  checkTextContains("README.md", "npm run check:installers");
  checkTextContains("README.md", "macOS / Windows / Linux installer");
  checkTextContains("README.md", "printf 'ja\\n4\\nKyoko\\n' | ./install.command");
  checkTextContains("README.md", "VOICEVOX Engine と npm ci");
  checkTextContains("README.md", "Kokoro.jsを使う場合は `npm ci`");
  checkTextContains("README.md", "npm run check:compat");
  checkTextContains("README.md", "private path");
  checkTextContains("README.md", "npm run check:swift-cli");
  checkTextContains("README.md", "check: failed -> fix .talking-pets.local.env");
  checkTextContains("README.md", "platform: macOS");
  checkTextContains("README.md", "config source: none");
  checkTextContains("README.md", "speech language: auto");
  checkTextContains("README.md", "VOICEVOX: ok (http://127.0.0.1:50021)");
  checkTextContains("README.md", "mixed-ja-en-rollout.jsonl");
  checkTextContains("README.md", "ko-zh-rollout.jsonl");
  checkTextContains("README.md", "[thread] manual rollout / manual-rollout");
  checkTextContains("README.md", "not reachable` でも続けられます");
  checkTextContains("README.md", "state DB check skipped (--no-state)");
  checkTextContains("README.md", "[rollout] test/fixtures/assistant-rollout.jsonl");
  checkTextContains("README.md", "This check skips local Codex state paths");
  checkTextContains("README.md", "Run npm run check:compat separately for stateful local Codex verification");
  checkTextContains("README.md", "For manual local dry-run debugging");
  checkTextContains("README.md", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("README.md", "既知の `TALKING_PETS_*` キー");
  checkTextContains("README.md", "生成音声、録画、archive、macOS metadata、ローカルSQLite DB名、モデルファイル名");
  checkTextContains("README.md", "ローカルSQLite DB名");
  checkTextContains("README.md", "--tts auto|voicevox|voicebox|kokoro|irodori|say");
  checkTextContains("README.md", "--speech-language auto|ja|en|ko|zh|other");
  checkTextContains("README.md", "--max-source-chars");
  checkTextContains("README.md", "--show-private-paths");
  checkTextContains("README.md", "<redacted path>");
  checkTextContains("README.md", "npm run sanitize:public-output");
  checkTextContains("README.md", "npm run check:sanitize");
  checkTextContains("README.md", "Platform verification issue");
  checkTextContains("README.md", "Evidence link");
  checkTextContains("README.md", "bug報告、install相談、TTS provider要望、platform verification");
  checkTextContains("README.md", "[CONTRIBUTING.md の Issues](CONTRIBUTING.md#issues)");
  checkTextContains("README.md", "TALKING_PETS_VOICEVOX_URL");
  checkTextContains("README.md", "TALKING_PETS_VOICEVOX_SPEAKER");
  checkTextContains("README.md", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("README.md", "Voicebox互換endpoint");
  checkTextContains("README.md", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("README.md", "TALKING_PETS_SAY_VOICE` はmacOS `say` のvoice名");
  checkTextContains("README.md", "Windows / Linux のOS音声fallbackでは未使用");
  checkTextContains("README.md", "`check.ps1` の compat は公開証跡向けのfixture-only確認");
  checkTextContains("README.md", "`check.sh` の compat は公開証跡向けのfixture-only確認");
  checkTextContains("README.md", "stateful Codex verification は `npm run check:compat`");
  checkTextContains("README.md", "npm run monitor:node -- --tts voicevox");
  checkTextContains("README.md", "npm run monitor:node -- --tts kokoro");
  checkTextContains("README.md", "npm run monitor:node -- --tts say");
  checkTextContains("README.md", "macOS安定版のSwift monitor");
  checkTextContains("README.md", ".\\install.ps1 -SpeechLanguage ja");
  checkTextContains("README.md", ".\\install.ps1 -Tts voicebox -VoiceboxMode generic");
  checkTextContains("README.md", "Windows OS speech、VOICEVOX、Kokoro.js、Voicebox-compatible endpoint、または Other local TTS");
  checkTextContains("README.md", "`start-selected-tts.ps1` は起動前に Node.js 22 以上");
  checkTextContains("README.md", "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("README.md", "\"ko\": { \"engine\": \"say\"");
  checkTextContains("README.md", "\"zh\": { \"engine\": \"say\"");
  checkTextContains("README.md", "ko-say-fallback.env");
  checkTextContains("README.md", "zh-say-fallback.env");
  checkTextContains("README.md", "ko-say-fallback.env`: OS speech fallback / Korean speech-language value");
  checkTextContains("README.md", "zh-say-fallback.env`: OS speech fallback / Chinese speech-language value");
  checkTextContains("README.md", "privacy-first-say.env`: OS speech fallback / `auto` speech-language, no model download");
  checkTextContains("README.md", "generic-voicebox.env`: Voicebox-compatible endpoint / generic mode / profile `default` / language `en`");
  checkTextContains("README.md", "npm ci");
  checkTextContains("README.en.md", "Safety Model");
  checkTextContains("README.en.md", "docs/verification-status.md");
  checkTextContains("README.en.md", "public-review-ready MVP");
  checkTextContains("README.en.md", "| Windows Node monitor | Experimental |");
  checkTextContains("README.en.md", "| Linux Node monitor | Experimental |");
  checkTextContains("README.en.md", "Windows and Linux support are still experimental.");
  checkTextContains("README.en.md", "Linux experimental:");
  checkTextContains("README.en.md", "`aplay`, `paplay`, or `ffplay");
  checkTextContains("README.en.md", "npm run check:config");
  checkTextContains("README.en.md", "npm run check:installers");
  checkTextContains("README.en.md", "macOS, Windows, and Linux installers");
  checkTextContains("README.en.md", "printf 'en\\n4\\nKyoko\\n' | ./install.command");
  checkTextContains("README.en.md", "VOICEVOX Engine and npm ci");
  checkTextContains("README.en.md", "run `npm ci` if you use Kokoro.js");
  checkTextContains("README.en.md", "npm run check:compat");
  checkTextContains("README.en.md", "private paths");
  checkTextContains("README.en.md", "npm run check:swift-cli");
  checkTextContains("README.en.md", "check: failed -> fix .talking-pets.local.env");
  checkTextContains("README.en.md", "platform: macOS");
  checkTextContains("README.en.md", "config source: none");
  checkTextContains("README.en.md", "speech language: auto");
  checkTextContains("README.en.md", "VOICEVOX: ok (http://127.0.0.1:50021)");
  checkTextContains("README.en.md", "mixed-ja-en-rollout.jsonl");
  checkTextContains("README.en.md", "ko-zh-rollout.jsonl");
  checkTextContains("README.en.md", "[thread] manual rollout / manual-rollout");
  checkTextContains("README.en.md", "`not reachable` is okay to continue");
  checkTextContains("README.en.md", "state DB check skipped (--no-state)");
  checkTextContains("README.en.md", "[rollout] test/fixtures/assistant-rollout.jsonl");
  checkTextContains("README.en.md", "This check skips local Codex state paths");
  checkTextContains("README.en.md", "Run npm run check:compat separately for stateful local Codex verification");
  checkTextContains("README.en.md", "For manual local dry-run debugging");
  checkTextContains("README.en.md", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("README.en.md", "known `TALKING_PETS_*` keys");
  checkTextContains("README.en.md", "recording names, archive names, macOS metadata names");
  checkTextContains("README.en.md", "local SQLite DB names");
  checkTextContains("README.en.md", "--tts auto|voicevox|voicebox|kokoro|irodori|say");
  checkTextContains("README.en.md", "--speech-language auto|ja|en|ko|zh|other");
  checkTextContains("README.en.md", "--max-source-chars");
  checkTextContains("README.en.md", "--show-private-paths");
  checkTextContains("README.en.md", "<redacted path>");
  checkTextContains("README.en.md", "npm run sanitize:public-output");
  checkTextContains("README.en.md", "npm run check:sanitize");
  checkTextContains("README.en.md", "Platform verification issue");
  checkTextContains("README.en.md", "Evidence link");
  checkTextContains("README.en.md", "For bug reports, install help, TTS provider requests, and platform verification");
  checkTextContains("README.en.md", "[Issues guide in CONTRIBUTING.md](CONTRIBUTING.md#issues)");
  checkTextContains("README.en.md", "TALKING_PETS_VOICEVOX_URL");
  checkTextContains("README.en.md", "TALKING_PETS_VOICEVOX_SPEAKER");
  checkTextContains("README.en.md", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("README.en.md", "Voicebox-compatible endpoint");
  checkTextContains("README.en.md", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("README.en.md", "TALKING_PETS_SAY_VOICE` is a macOS `say` voice name");
  checkTextContains("README.en.md", "not used by the Windows / Linux OS speech fallback");
  checkTextContains("README.en.md", "`check.ps1` compatibility output is fixture-only for public evidence");
  checkTextContains("README.en.md", "`check.sh` compatibility output is fixture-only for public evidence");
  checkTextContains("README.en.md", "Run `npm run check:compat` separately for stateful Codex verification");
  checkTextContains("README.en.md", "npm run monitor:node -- --tts voicevox");
  checkTextContains("README.en.md", "npm run monitor:node -- --tts kokoro");
  checkTextContains("README.en.md", "npm run monitor:node -- --tts say");
  checkTextContains("README.en.md", "stable macOS Swift monitor");
  checkTextContains("README.en.md", ".\\install.ps1 -SpeechLanguage ja");
  checkTextContains("README.en.md", ".\\install.ps1 -Tts voicebox -VoiceboxMode generic");
  checkTextContains("README.en.md", "Windows OS speech, VOICEVOX, Kokoro.js, a Voicebox-compatible endpoint, or Other local TTS");
  checkTextContains("README.en.md", "`start-selected-tts.ps1` checks for Node.js 22 or later");
  checkTextContains("README.en.md", "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("README.en.md", "\"ko\": { \"engine\": \"say\"");
  checkTextContains("README.en.md", "\"zh\": { \"engine\": \"say\"");
  checkTextContains("README.en.md", "ko-say-fallback.env");
  checkTextContains("README.en.md", "zh-say-fallback.env");
  checkTextContains("README.en.md", "ko-say-fallback.env`: OS speech fallback / Korean speech-language value");
  checkTextContains("README.en.md", "zh-say-fallback.env`: OS speech fallback / Chinese speech-language value");
  checkTextContains("README.en.md", "privacy-first-say.env`: OS speech fallback / `auto` speech-language, no model download");
  checkTextContains("README.en.md", "generic-voicebox.env`: Voicebox-compatible endpoint / generic mode / profile `default` / language `en`");
  checkTextContains("README.en.md", "npm ci");
  checkTextContains("demo/index.html", "../src/talking-pet-mvp.js");
  checkTextContains("src/talking-pet-mvp.js", "window.TalkingPetMVP");
  checkTextContains("scripts/check-codex-compat.mjs", "mixed-ja-en-rollout.jsonl");
  checkTextContains("scripts/check-codex-compat.mjs", "ko-zh-rollout.jsonl");
  checkTextContains("scripts/check-codex-compat.mjs", "--show-private-paths");
  checkTextContains("scripts/check-codex-compat.mjs", "<redacted path>");
  checkTextContains("scripts/pet-rollout-monitor.mjs", "--show-private-paths");
  checkTextContains("scripts/pet-rollout-monitor.mjs", "displayPrivatePath");
  checkTextContains("scripts/sanitize-public-output.mjs", "sanitizePublicOutput");
  checkTextContains("scripts/sanitize-public-output.mjs", "<redacted conversation text>");
  checkTextContains("scripts/sanitize-public-output.mjs", "<redacted credential>");
  checkTextContains("scripts/sanitize-public-output.mjs", "%USERPROFILE%");
  checkTextContains("scripts/sanitize-public-output.mjs", "${HOME}");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "sanitizePublicOutput");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "Jane Doe");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "private-demo.mov");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "private demo.mov");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "private rollout.jsonl");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "TALKING_PETS_VOICEBOX_URL=<redacted>");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "X-Api-Key: <redacted credential>");
  checkTextContains("scripts/check-public-output-sanitizer.mjs", "<redacted artifact>");
  checkTextContains("test/monitor.test.mjs", "redacts private rollout paths from monitor diagnostics by default");
  checkTextContains("test/monitor.test.mjs", "sanitizes public check output before issue sharing");
  checkTextContains("test/monitor.test.mjs", "%USERPROFILE%");
  checkTextContains("test/monitor.test.mjs", "$HOME");
  checkTextContains("docs/release-notes-template.md", "Known Limits");
  checkTextContains("docs/release-notes-template.md", "Evidence link");
  checkTextContains("docs/release-notes-template.md", "Initial public preview for local Codex Pet / assistant speech with local TTS");
  checkTextContains("docs/release-notes-template.md", "No upgrade steps for the initial public preview");
  checkTextDoesNotContain("docs/release-notes-template.md", "\n- \n");
  checkTextContains("docs/release-notes-template.md", "Platform verification issue");
  checkTextContains("docs/release-notes-template.md", "Review `docs/verification-status.md` first");
  checkTextContains("docs/release-notes-template.md", "platform status, verified commands, or evidence links");
  checkTextContains("docs/release-notes-template.md", "Codex Desktop / CLI version in evidence when known");
  checkTextContains("docs/release-notes-template.md", "Node.js <version> / npm <version> / Codex: <version|unknown>");
  checkTextContains("docs/release-notes-template.md", "config source: <installer default|preset|custom|none>");
  checkTextContains("docs/release-notes-template.md", "| Windows | Experimental |");
  checkTextContains("docs/release-notes-template.md", "| Linux | Experimental |");
  checkTextContains("docs/release-notes-template.md", "public preview with macOS stable and Windows / Linux experimental support");
  checkTextContains("docs/release-notes-template.md", "Windows and Linux audible TTS evidence can be collected after publication");
  checkTextContains("docs/release-notes-template.md", "Windows / Linux remain experimental");
  checkTextContains("docs/release-notes-template.md", "OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known");
  checkTextContains("docs/release-notes-template.md", "sanitized Platform verification issue link");
  checkTextContains("docs/release-notes-template.md", "CI, fixture-only dry-runs, package checks, and `npm run check:compat -- --no-state` are release gates only");
  checkTextContains("docs/release-notes-template.md", "not platform graduation evidence");
  checkTextContains("docs/release-notes-template.md", "follow-up reports, not release evidence");
  checkTextContains("docs/release-notes-template.md", "If a verifier has no local Codex state yet");
  checkTextContains("docs/release-notes-template.md", "supplemental fixture evidence");
  checkTextContains("docs/release-notes-template.md", "not stateful Codex verification for platform graduation");
  checkTextContains("docs/release-notes-template.md", "speech-language: auto|ja|en|ko|zh|other");
  checkTextContains("docs/release-notes-template.md", "sanitized: yes|no");
  checkTextContains("docs/release-notes-template.md", "TTS: macOS say|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS");
  checkTextContains("docs/release-notes-template.md", "TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS");
  checkTextContains("docs/release-notes-template.md", "TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS");
  checkTextContains("docs/release-notes-template.md", "--speech-language ko");
  checkTextContains("docs/release-notes-template.md", "--speech-language zh");
  checkTextContains("docs/release-notes-template.md", "npm ci");
  checkTextContains("docs/release-notes-template.md", "npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "npm run test:dry-run");
  checkTextContains("docs/release-notes-template.md", "./check.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", ".\\check.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "./check.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "npm run check:swift-cli");
  checkTextContains("docs/release-notes-template.md", "./install.command");
  checkTextContains("docs/release-notes-template.md", ".\\install.ps1");
  checkTextContains("docs/release-notes-template.md", "./install.sh");
  checkTextContains("docs/release-notes-template.md", "./scripts/pet-rollout-monitor.command --once --dry-run");
  checkTextContains("docs/release-notes-template.md", "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko");
  checkTextContains("docs/release-notes-template.md", "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/release-notes-template.md", "npm run monitor:node -- --tts say --speech-language ko");
  checkTextContains("docs/real-device-verification.md", "npm run monitor:node -- --tts say --speech-language ko");
  const releaseEvidenceDocs = new Map([
    ["docs/release-notes-template.md", readText("docs/release-notes-template.md")],
    ["docs/real-device-verification.md", readText("docs/real-device-verification.md")],
    ["docs/verification-status.md", readText("docs/verification-status.md")],
    [".github/ISSUE_TEMPLATE/platform_verification.yml", readText(".github/ISSUE_TEMPLATE/platform_verification.yml")],
  ]);
  let packageScripts = {};
  try {
    packageScripts = JSON.parse(readFileSync(join(root, "package.json"), "utf8")).scripts ?? {};
  } catch {
    packageScripts = {};
  }
  for (const message of releaseEvidenceIssues(releaseEvidenceDocs, packageScripts)) {
    fail(message);
  }
  const publicNpmRunReferenceDocs = new Map(publicNpmRunReferenceFiles.map(file => [file, readText(file)]));
  for (const message of npmRunReferenceIssues(publicNpmRunReferenceDocs, packageScripts)) {
    fail(message);
  }
  checkTextContains("docs/release-notes-template.md", "local env files");
  checkTextContains("docs/release-notes-template.md", "local recordings, archives");
  checkTextContains("docs/release-notes-template.md", "downloaded model files");
  checkTextContains("docs/release-notes-template.md", "private rollout JSONL");
  checkTextContains("docs/release-notes-template.md", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("docs/release-notes-template.md", "Before changing a platform from Experimental to Stable");
  checkTextContains("docs/release-notes-template.md", "update `docs/verification-status.md` first");
  checkTextContains("docs/release-notes-template.md", "install, platform check, dry-run, one audible TTS command");
  checkTextContains("docs/release-notes-template.md", "`audible: yes`, `sanitized: yes`");
  checkTextContains("docs/release-notes-template.md", "no local Codex state yet");
  checkTextContains("docs/release-notes-template.md", "copy the reviewed row template from `docs/verification-status.md`");
  checkTextContains("docs/release-notes-template.md", "the Platform verification issue link together");
  checkTextContains("docs/release-notes-template.md", "./install.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "./scripts/pet-rollout-monitor.command --once --dry-run 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", ".\\install.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "./install.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/release-notes-template.md", "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "Pass criteria");
  checkTextContains("docs/real-device-verification.md", "Quick Contributor Request");
  checkTextContains("docs/real-device-verification.md", "send them this short checklist");
  checkTextContains("docs/real-device-verification.md", "Copy-paste request");
  checkTextContains("docs/real-device-verification.md", "Could you verify Talking Pets on a real Windows or Linux device?");
  checkTextContains("docs/real-device-verification.md", "Only evidence marked audible: yes and sanitized: yes can be used to graduate Windows or Linux from experimental");
  checkTextContains("docs/real-device-verification.md", "CI, fixture rollouts, `npm run check:compat -- --no-state`, and sanitized dry-run output");
  checkTextContains("docs/real-device-verification.md", "must not be used by themselves to graduate a platform");
  checkTextContains("docs/real-device-verification.md", "Sanitize every command output you plan to paste publicly");
  checkTextContains("docs/real-device-verification.md", "any pasted check, dry-run, installer, or TTS logs");
  checkTextContains("docs/real-device-verification.md", "Windows Experimental Path");
  checkTextContains("docs/real-device-verification.md", "Linux Experimental Path");
  checkTextContains("docs/real-device-verification.md", "Windows / Linux remain experimental");
  checkTextContains("docs/real-device-verification.md", "do not count as release evidence for graduating Windows or Linux");
  checkTextContains("docs/real-device-verification.md", "Evidence link");
  checkTextContains("docs/real-device-verification.md", "./install.command");
  checkTextContains("docs/real-device-verification.md", ".\\install.ps1");
  checkTextContains("docs/real-device-verification.md", "./install.sh");
  checkTextContains("docs/real-device-verification.md", "npm run test:dry-run");
  checkTextContains("docs/real-device-verification.md", "`test:dry-run` prints public fixture `[source]` and `[pet]` lines");
  checkTextContains("docs/real-device-verification.md", "Sanitization check");
  checkTextContains("docs/real-device-verification.md", "Public evidence is sanitized");
  checkTextContains("docs/real-device-verification.md", "npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "./install.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "./check.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "./scripts/pet-rollout-monitor.command --once --dry-run 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", ".\\install.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", ".\\check.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "./install.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "./check.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/real-device-verification.md", "Speech-language value");
  checkTextContains("docs/real-device-verification.md", "Config source");
  checkTextContains("docs/real-device-verification.md", "Node.js <version>, npm <version>, Codex: <version|unknown>");
  checkTextContains("docs/real-device-verification.md", "speech-language: auto|ja|en|ko|zh|other, config source: <installer default|preset|custom|none>, audible: yes|no, sanitized: yes|no");
  checkTextContains("docs/real-device-verification.md", "`macOS say`, `Windows OS speech`, `Linux espeak`");
  checkTextContains("docs/real-device-verification.md", "Voicebox-compatible endpoint");
  checkTextContains("docs/real-device-verification.md", "Node.js <version>, npm <version>, Codex: <version|unknown>, TTS: macOS say|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS");
  checkTextContains("docs/real-device-verification.md", "Node.js <version>, npm <version>, Codex: <version|unknown>, TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS");
  checkTextContains("docs/real-device-verification.md", "Node.js <version>, npm <version>, Codex: <version|unknown>, TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS");
  checkTextContains("docs/real-device-verification.md", "must not end with `check: failed -> fix .talking-pets.local.env`");
  checkTextContains("docs/real-device-verification.md", "--speech-language ko");
  checkTextContains("docs/real-device-verification.md", "--speech-language zh");
  checkTextContains("docs/real-device-verification.md", "downloaded model files");
  checkTextContains("docs/real-device-verification.md", "local recordings, archives");
  checkTextContains("docs/real-device-verification.md", "private rollout JSONL");
  checkTextContains("docs/real-device-verification.md", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("docs/real-device-verification.md", "./check.sh");
  checkTextContains("docs/release-notes-template.md", "./check.sh");
  checkTextContains(".gitignore", ".talking-pets.local.env");
  checkTextContains(".gitignore", ".env.*");
  checkTextContains(".gitignore", "*.wav");
  checkTextContains(".gitignore", "*.mp3");
  checkTextContains(".gitignore", "*.mp4");
  checkTextContains(".gitignore", "*.mov");
  checkTextContains(".gitignore", "!docs/demo/talking-pets-overlay-2026-05-28.mov");
  checkTextContains(".gitignore", "*.zip");
  checkTextContains(".gitignore", "*.sqlite");
  checkTextContains(".gitignore", "*.sqlite3");
  checkTextContains(".gitignore", "*.db");
  checkTextContains(".gitignore", "*.onnx");
  checkTextContains(".gitignore", "*.log");
  checkTextContains(".gitignore", "node_modules/");
  checkTextContains(".gitignore", "local-experimental/");
  checkTextContains("FUTURE_PLAN.md", "generated audio, local recordings, archives, model files");
  checkTextContains(".npmignore", ".github/");
  checkTextContains(".npmignore", "test/*");
  checkTextContains(".npmignore", "!test/fixtures/assistant-rollout.jsonl");
  checkTextContains(".npmignore", "!test/fixtures/mixed-ja-en-rollout.jsonl");
  checkTextContains(".npmignore", "!test/fixtures/ko-zh-rollout.jsonl");
  checkTextContains(".npmignore", "implementation-notes.md");
  checkTextContains(".npmignore", "*.mov");
  checkTextDoesNotContain(".npmignore", "docs/public-repo-review-checklist.md");
  checkTextContains(".npmignore", ".talking-pets.local.env");
  checkTextContains(".npmignore", "*.sqlite");
  checkTextContains(".npmignore", "*.sqlite3");
  checkTextContains(".npmignore", "*.db");
  checkTextContains(".npmignore", "*.onnx");
  checkTextContains(".npmignore", "*.mp4");
  checkTextContains(".npmignore", "*.zip");
  checkTextContains("README.md", "src=\"https://github.com/arata-ai-daisuki/talking-pets/raw/main/docs/demo/talking-pets-overlay-2026-05-28.mov\"");
  checkTextContains("README.md", "https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/demo/talking-pets-overlay-2026-05-28.mov");
  checkTextContains("README.md", "docs/demo/talking-pets-overlay-2026-05-28-frame.png");
  checkTextContains("README.en.md", "src=\"https://github.com/arata-ai-daisuki/talking-pets/raw/main/docs/demo/talking-pets-overlay-2026-05-28.mov\"");
  checkTextContains("README.en.md", "https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/demo/talking-pets-overlay-2026-05-28.mov");
  checkTextContains("README.en.md", "docs/demo/talking-pets-overlay-2026-05-28-frame.png");
  checkTextDoesNotContain("README.md", "src=\"docs/demo/talking-pets-overlay-2026-05-28.mov\"");
  checkTextDoesNotContain("README.en.md", "src=\"docs/demo/talking-pets-overlay-2026-05-28.mov\"");
  checkTextContains("CONTRIBUTING.md", "./check.sh");
  checkTextContains("CONTRIBUTING.md", "npm run monitor:node -- --once --dry-run");
  checkTextContains("CONTRIBUTING.md", "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("CONTRIBUTING.md", "npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("CONTRIBUTING.md", "downloaded model files");
  checkTextContains("CONTRIBUTING.md", "macOS metadata");
  checkTextContains("CONTRIBUTING.md", "Quick Contributor Request");
  checkTextContains("CONTRIBUTING.md", "npm run sanitize:public-output");
  checkTextContains("CONTRIBUTING.md", "If you paste installer output for platform verification, sanitize that output too");
  checkTextContains("CONTRIBUTING.md", "./install.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("CONTRIBUTING.md", ".\\install.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("CONTRIBUTING.md", "./install.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("SECURITY.md", "Do not include private Codex logs");
  checkTextContains("SECURITY.md", "private rollout JSONL files");
  checkTextContains("README.md", "ローカルSQLite DB");
  checkTextContains("README.md", "よくある credential env/header");
  checkTextContains("README.md", "private rollout JSONL");
  checkTextContains("README.md", "公開fixtureの `test/fixtures/assistant-rollout.jsonl`");
  checkTextContains("README.md", "credentials は自動判定しきれない場合がある");
  checkTextContains("README.en.md", "local SQLite DBs");
  checkTextContains("README.en.md", "common credential env/header patterns");
  checkTextContains("README.en.md", "private rollout JSONL");
  checkTextContains("README.en.md", "keeps the public fixture paths `test/fixtures/assistant-rollout.jsonl`");
  checkTextContains("README.en.md", "credentials cannot always be detected automatically");
  checkTextContains("CONTRIBUTING.md", "keeps the known public fixture rollout paths visible for evidence");
  checkTextContains("SECURITY.md", "local SQLite DBs");
  checkTextContains("SECURITY.md", "generated audio or recordings containing private content");
  checkTextContains("SECURITY.md", "local archives");
  checkTextContains("SECURITY.md", "local env files");
  checkTextContains("SECURITY.md", "macOS metadata");
  checkTextContains("SECURITY.md", "downloaded model files");
  checkTextContains("SECURITY.md", "request URLs are logged without query strings");
  checkTextContains("SECURITY.md", "npm run sanitize:public-output");
  checkTextContains("SECURITY.md", "private paths, conversation text, local env values, common credential env/header patterns");
  checkTextContains("SECURITY.md", "generated audio names, recording names, archive names, macOS metadata names");
  checkTextContains("SECURITY.md", "local SQLite DB names, and model filenames");
  checkTextContains("SECURITY.md", "keeps the known public fixture rollout paths visible for evidence");
  checkTextContains("CREDITS.md", "Voicebox-Compatible And Custom Local TTS Endpoints");
  checkTextContains("CREDITS.md", "TALKING_PETS_TTS=\"voicebox\"");
  checkTextContains("CREDITS.md", "required credit notation");
  checkTextContains("CREDITS.md", "Custom endpoints may receive conversation text");
  checkTextContains("docs/release-notes-template.md", "Voicebox-compatible endpoint/custom local TTS");
  checkTextContains("README.md", "Voicebox互換endpoint / Codex");
  checkTextContains("README.en.md", "Voicebox-compatible endpoints, Codex");
  checkTextContains("scripts/tts-voicebox.mjs", "safeURLForLog");
  checkTextContains("scripts/tts-voicebox.mjs", "parsed.hash = \"\"");
  checkTextContains("test/monitor.test.mjs", "redacts spoken text from voicebox error URLs");
  checkTextContains("test/monitor.test.mjs", "validates Voicebox CLI options without sending text");
  checkTextContains("test/monitor.test.mjs", "redacts private paths from stateful compat diagnostics");
  checkTextContains("test/monitor.test.mjs", "reports compat CLI argument errors without a stack trace");
  checkTextContains("test/monitor.test.mjs", "reports audio check CLI argument errors without a stack trace");
  checkTextContains("check.ps1", "Import-LocalConfig");
  checkTextContains("check.ps1", "Invoke-NodeDiagnostic");
  checkTextContains("check.ps1", "dry run: skipped -> Node.js 22 or later is required");
  checkTextContains("check.command", "test/fixtures/assistant-rollout.jsonl");
  checkTextContains("check.ps1", "test/fixtures/assistant-rollout.jsonl");
  checkTextContains("check.sh", "test/fixtures/assistant-rollout.jsonl");
  checkTextContains("check.command", "scripts/check-codex-compat.mjs\" --no-state");
  checkTextContains("check.ps1", "\"scripts/check-codex-compat.mjs\", \"--no-state\"");
  checkTextContains("check.sh", "scripts/check-codex-compat.mjs\" --no-state");
  checkTextDoesNotContain("check.command", "$ROOT_DIR/test/fixtures/assistant-rollout.jsonl");
  checkTextDoesNotContain("check.sh", "$ROOT_DIR/test/fixtures/assistant-rollout.jsonl");
  checkTextContains("check.command", "skips local Codex state paths");
  checkTextContains("check.ps1", "skips local Codex state paths");
  checkTextContains("check.sh", "skips local Codex state paths");
  checkTextContains("check.command", "load_config");
  checkTextContains("start-selected-tts.command", "load_config");
  checkTextContains("check.command", "platform:");
  checkTextContains("check.command", "uname -m");
  checkTextContains("check.command", "config source:");
  checkTextContains("check.command", "config: .talking-pets.local.env");
  checkTextContains("check.command", "tts: unset");
  checkTextContains("check.command", "speech language:");
  checkTextContains("check.command", "Before sharing this output publicly");
  checkTextContains("check.command", "credential env/header values");
  checkTextContains("check.command", "local SQLite DBs such as state_5.sqlite");
  checkTextContains("check.command", "private rollout JSONL");
  checkTextContains("check.command", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("check.command", "local recordings, archives, macOS metadata");
  checkTextContains("check.command", "state_5.sqlite");
  checkTextContains("check.command", "downloaded model files");
  checkTextContains("check.command", "run npm ci if you use Kokoro.js");
  checkTextContains("check.command", "redact_endpoint_for_log");
  checkTextContains("check.command", "<redacted endpoint>");
  checkTextContains("check.sh", "redact_endpoint_for_log");
  checkTextContains("check.sh", "<redacted endpoint>");
  checkTextContains("check.ps1", "Format-EndpointForLog");
  checkTextContains("check.ps1", "<redacted endpoint>");
  checkTextContains("check.command", "clear_config\nif [[ -f \"$CONFIG_FILE\" ]]");
  checkTextContains("check.command", "config_status=0");
  checkTextContains("check.command", "config source: invalid local file");
  checkTextContains("check.command", "check: failed -> fix .talking-pets.local.env");
  checkTextContains("check.command", "clear_config");
  checkTextContains("start-selected-tts.command", "clear_config");
  checkTextContains("check.command", "$'\\xef\\xbb\\xbf'");
  checkTextContains("start-selected-tts.command", "未対応の設定キー");
  checkTextContains("start-selected-tts.command", "$'\\xef\\xbb\\xbf'");
  checkTextContains("check.ps1", "AllowedConfigKeys");
  checkTextContains("check.ps1", "platform:");
  checkTextContains("check.ps1", "OSArchitecture");
  checkTextContains("check.ps1", "config source:");
  checkTextContains("check.ps1", "config: .talking-pets.local.env");
  checkTextContains("check.ps1", "tts: unset");
  checkTextContains("check.ps1", "speech language:");
  checkTextContains("check.ps1", "Before sharing this output publicly");
  checkTextContains("check.ps1", "credential env/header values");
  checkTextContains("check.ps1", "local SQLite DBs such as state_5.sqlite");
  checkTextContains("check.ps1", "private rollout JSONL");
  checkTextContains("check.ps1", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("check.ps1", "local recordings, archives, macOS metadata");
  checkTextContains("check.ps1", "state_5.sqlite");
  checkTextContains("check.ps1", "downloaded model files");
  checkTextContains("check.ps1", "run npm ci if you use Kokoro.js");
  checkTextContains("check.ps1", "Clear-LocalConfig\nImport-LocalConfig");
  checkTextContains("check.ps1", "$script:ConfigStatus = 0");
  checkTextContains("check.ps1", "config source: invalid local file");
  checkTextContains("check.ps1", "check: failed -> fix .talking-pets.local.env");
  checkTextContains("check.ps1", "[char]0xFEFF");
  checkTextContains("check.ps1", "^([A-Z0-9_]+)=\"([^\"]*)\"$");
  checkTextContains("start-selected-tts.ps1", "AllowedConfigKeys");
  checkTextContains("start-selected-tts.ps1", "[char]0xFEFF");
  checkTextContains("start-selected-tts.ps1", "^([A-Z0-9_]+)=\"([^\"]*)\"$");
  checkTextContains("check.ps1", "Clear-LocalConfig");
  checkTextContains("start-selected-tts.ps1", "Clear-LocalConfig");
  checkTextContains("check.sh", "load_config");
  checkTextContains("check.sh", "platform:");
  checkTextContains("check.sh", "uname -m");
  checkTextContains("check.sh", "config source:");
  checkTextContains("check.sh", "config: .talking-pets.local.env");
  checkTextContains("check.sh", "tts: unset");
  checkTextContains("check.sh", "speech language:");
  checkTextContains("check.sh", "Before sharing this output publicly");
  checkTextContains("check.sh", "credential env/header values");
  checkTextContains("check.sh", "local SQLite DBs such as state_5.sqlite");
  checkTextContains("check.sh", "private rollout JSONL");
  checkTextContains("check.sh", "Known public fixture rollout paths may remain visible as evidence");
  checkTextContains("check.sh", "local recordings, archives, macOS metadata");
  checkTextContains("check.sh", "state_5.sqlite");
  checkTextContains("check.sh", "downloaded model files");
  checkTextContains("check.sh", "run npm ci if you use Kokoro.js");
  checkTextContains("check.sh", "clear_config\nif [[ -f \"$CONFIG_FILE\" ]]");
  checkTextContains("check.sh", "config_status=0");
  checkTextContains("check.sh", "config source: invalid local file");
  checkTextContains("check.sh", "check: failed -> fix .talking-pets.local.env");
  checkTextContains("start-selected-tts.sh", "load_config");
  checkTextContains("check.sh", "$'\\xef\\xbb\\xbf'");
  checkTextContains("start-selected-tts.sh", "Unsupported config key");
  checkTextContains("start-selected-tts.sh", "$'\\xef\\xbb\\xbf'");
  const localConfigFailureScripts = new Map([
    ["check.command", readText("check.command")],
    ["start-selected-tts.command", readText("start-selected-tts.command")],
    ["check.ps1", readText("check.ps1")],
    ["start-selected-tts.ps1", readText("start-selected-tts.ps1")],
    ["check.sh", readText("check.sh")],
    ["start-selected-tts.sh", readText("start-selected-tts.sh")],
  ]);
  for (const message of localConfigFailureLogIssues(localConfigFailureScripts)) {
    fail(message);
  }
  checkTextContains("start-selected-tts.command", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("start-selected-tts.command", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("start-selected-tts.command", "--speech-language");
  checkTextContains("start-selected-tts.command", "voicebox_config_args");
  checkTextContains("start-selected-tts.command", "--voicebox-profile");
  checkTextContains("start-selected-tts.command", "--voicebox-language");
  checkTextContains("start-selected-tts.ps1", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("start-selected-tts.ps1", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("start-selected-tts.ps1", "--speech-language");
  checkTextContains("start-selected-tts.ps1", "TALKING_PETS_VOICEBOX_PROFILE");
  checkTextContains("start-selected-tts.ps1", "TALKING_PETS_VOICEBOX_LANGUAGE");
  checkTextContains("start-selected-tts.ps1", "--voicebox-profile");
  checkTextContains("start-selected-tts.ps1", "--voicebox-language");
  checkTextContains("start-selected-tts.ps1", "Get-Command node");
  checkTextContains("start-selected-tts.ps1", "Node.js 22 or later is required for Windows support");
  checkTextContains("start-selected-tts.ps1", "node --no-warnings @args");
  checkTextContains("start-selected-tts.sh", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("start-selected-tts.sh", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("start-selected-tts.sh", "--speech-language");
  checkTextContains("start-selected-tts.sh", "voicebox_config_args");
  checkTextContains("start-selected-tts.sh", "--voicebox-profile");
  checkTextContains("start-selected-tts.sh", "--voicebox-language");
  checkTextContains("install.command", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("install.command", "Voicebox-compatible endpoint");
  checkTextContains("install.command", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("install.command", "TALKING_PETS_VOICEBOX_PROFILE");
  checkTextContains("install.command", "TALKING_PETS_VOICEBOX_LANGUAGE");
  checkTextContains("install.command", "\"auto\"");
  checkTextContains("install.command", "Saved config: .talking-pets.local.env");
  checkTextContains("install.command", "Running npm ci");
  checkTextDoesNotContain("install.command", "Saved config: $CONFIG_FILE");
  checkTextDoesNotContain("install.command", "npm install");
  checkTextContains("install.ps1", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("install.ps1", "ValidateSet(\"auto\", \"voicevox\", \"voicebox\", \"kokoro\", \"irodori\", \"say\")");
  checkTextContains("install.ps1", "ValidateSet(\"voicevox\", \"generic\")");
  checkTextContains("install.ps1", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("install.ps1", "TALKING_PETS_VOICEBOX_PROFILE");
  checkTextContains("install.ps1", "TALKING_PETS_VOICEBOX_LANGUAGE");
  checkTextContains("install.ps1", "ValidateSet(\"auto\", \"ja\", \"en\", \"ko\", \"zh\", \"other\")");
  checkTextContains("install.ps1", "npm ci");
  checkTextContains("install.ps1", "Saved config: .talking-pets.local.env");
  checkTextDoesNotContain("install.ps1", "Saved config: $Config");
  checkTextDoesNotContain("install.ps1", "npm install");
  checkTextContains("install.sh", "Talking Pets Linux installer");
  checkTextContains("install.sh", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("install.sh", "start-selected-tts.sh");
  checkTextContains("install.sh", "Running npm ci");
  checkTextContains("install.sh", "Saved config: .talking-pets.local.env");
  checkTextDoesNotContain("install.sh", "Saved config: $CONFIG_FILE");
  checkTextDoesNotContain("install.sh", "npm install");
  checkTextContains("README.md", "./check.sh");
  checkTextContains("README.md", "./install.sh");
  checkTextContains("README.md", "npm ci\n./install.sh");
  checkTextContains("README.en.md", "./check.sh");
  checkTextContains("README.en.md", "./install.sh");
  checkTextContains("README.en.md", "npm ci\n./install.sh");
  checkTextContains("README.md", "npm run check:pack");
  checkTextContains("README.md", "package.json` は `private: true`");
  checkTextContains("README.md", "`npm run check:pack` は npm publish の準備ではなく、配布対象の範囲確認");
  checkTextContains("README.md", "一時npm cache");
  checkTextContains("README.md", "npm run test:dry-run");
  checkTextContains("README.md", "audible: yes");
  checkTextContains("README.md", "sanitized: yes");
  checkTextContains("README.md", "OS/version");
  checkTextContains("README.md", "CPU architecture");
  checkTextContains("README.md", "Node.js and npm versions");
  checkTextContains("README.md", "TTS path tested");
  checkTextContains("README.md", "speech-language value");
  checkTextContains("README.md", "Codex Desktop / CLI version if known");
  checkTextContains("README.md", "Platform verification issue link");
  checkTextContains("README.md", "初回公開は macOS stable / Windows・Linux experimental の public preview");
  checkTextContains("README.md", "Windows / Linux の実機 audible TTS 証跡は公開後に Platform verification issue で集める");
  checkTextContains("README.md", "CI-only、fixture-only、`--no-state`、package check の証跡はrelease gate");
  checkTextContains("README.md", "Windows / Linux のexperimental解除には使わない");
  checkTextContains("README.en.md", "npm run check:pack");
  checkTextContains("README.en.md", "package.json` intentionally remains `private: true`");
  checkTextContains("README.en.md", "`npm run check:pack` is a package-scope audit, not npm publish preparation");
  checkTextContains("README.en.md", "temporary npm cache");
  checkTextContains("README.en.md", "npm run test:dry-run");
  checkTextContains("README.en.md", "npm run check:sanitize");
  checkTextContains("README.en.md", "audible: yes");
  checkTextContains("README.en.md", "sanitized: yes");
  checkTextContains("README.en.md", "OS/version");
  checkTextContains("README.en.md", "CPU architecture");
  checkTextContains("README.en.md", "Node.js and npm versions");
  checkTextContains("README.en.md", "TTS path tested");
  checkTextContains("README.en.md", "speech-language value");
  checkTextContains("README.en.md", "Codex Desktop / CLI version if known");
  checkTextContains("README.en.md", "Platform verification issue link");
  checkTextContains("README.en.md", "macOS stable / Windows and Linux experimental public preview");
  checkTextContains("README.en.md", "Collect Windows and Linux audible TTS evidence after publication");
  checkTextContains("README.en.md", "Treat CI-only, fixture-only, `--no-state`, and package-check evidence as release gates");
  checkTextContains("README.en.md", "not evidence for graduating Windows or Linux from experimental");
  checkTextContains("CONTRIBUTING.md", "npm run check:pack");
  checkTextContains("CONTRIBUTING.md", "npm run check:sanitize");
  checkTextContains("CONTRIBUTING.md", "npm run check:installers");
  checkTextContains("CONTRIBUTING.md", "npm run check:platform-scripts");
  checkTextContains("CONTRIBUTING.md", "npm run check:swift-cli");
  checkTextContains("CONTRIBUTING.md", "common credential env/header patterns");
  checkTextContains("CONTRIBUTING.md", "manually remove credentials");
  checkTextContains("CONTRIBUTING.md", "./check.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("CONTRIBUTING.md", ".\\check.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("CONTRIBUTING.md", "./check.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("CONTRIBUTING.md", "npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl");
  checkTextContains("CONTRIBUTING.md", "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl");
  checkTextContains("CONTRIBUTING.md", "The sanitizer reads stdin or one input file");
  checkTextContains("CONTRIBUTING.md", "If audio fails or no spoken line is audible");
  checkTextContains("CONTRIBUTING.md", "does not count toward graduating Windows or Linux from experimental");
  checkTextContains("CONTRIBUTING.md", "Release evidence must include OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS command output");
  checkTextContains("CONTRIBUTING.md", "TTS path tested, speech-language value, config source");
  checkTextContains("CONTRIBUTING.md", "Codex Desktop / CLI version if known");
  checkTextContains("CONTRIBUTING.md", "`audible: yes`, `sanitized: yes`, and the sanitized Platform verification issue link");
  checkTextContains("CONTRIBUTING.md", "CI-only, fixture-only, `--no-state`, and package-check output are release gates");
  checkTextContains("CONTRIBUTING.md", "not Windows / Linux graduation evidence");
  checkTextContains("CONTRIBUTING.md", "Choose the issue template that matches the work");
  checkTextContains("CONTRIBUTING.md", "Bug report: broken behavior after setup");
  checkTextContains("CONTRIBUTING.md", "Install trouble: setup, first run, local config, audio path, or starter script problems");
  checkTextContains("CONTRIBUTING.md", "Platform verification: real-device install, platform check, dry-run, and audible TTS evidence");
  checkTextContains("CONTRIBUTING.md", "TTS provider request: a new local TTS provider");
  checkTextContains("CONTRIBUTING.md", "CPU architecture");
  checkTextContains("CONTRIBUTING.md", "Node.js and npm versions");
  checkTextContains("CONTRIBUTING.md", "Speech-language value and config source when reporting audio or platform verification");
  checkTextContains("CONTRIBUTING.md", "Codex Desktop / CLI version if known");
  checkTextContains("CONTRIBUTING.md", "./install.command");
  checkTextContains("CONTRIBUTING.md", ".\\install.ps1");
  checkTextContains("CONTRIBUTING.md", "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "npm pack scope");
  checkTextContains("docs/public-repo-review-checklist.md", "Run the common local release gate before tagging");
  checkTextContains("docs/public-repo-review-checklist.md", "macOS evidence commands");
  checkTextContains("docs/public-repo-review-checklist.md", "Windows evidence commands");
  checkTextContains("docs/public-repo-review-checklist.md", "Linux evidence commands");
  checkTextContains("docs/public-repo-review-checklist.md", "Quick Contributor Request");
  checkTextContains("docs/public-repo-review-checklist.md", "copy-paste request");
  checkTextContains("docs/public-repo-review-checklist.md", "./install.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", ".\\install.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "./install.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "./scripts/pet-rollout-monitor.command --once --dry-run 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "npm ci");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:all");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:compat");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:runtime");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run test:dry-run");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:audio:strict");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "./install.command");
  checkTextContains("docs/public-repo-review-checklist.md", "./check.command 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "./check.command");
  checkTextContains("docs/public-repo-review-checklist.md", ".\\install.ps1");
  checkTextContains("docs/public-repo-review-checklist.md", ".\\check.ps1 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", ".\\check.ps1");
  checkTextContains("docs/public-repo-review-checklist.md", "./install.sh");
  checkTextContains("docs/public-repo-review-checklist.md", "./check.sh 2>&1 | npm run sanitize:public-output");
  checkTextContains("docs/public-repo-review-checklist.md", "./check.sh");
  checkTextContains("docs/public-repo-review-checklist.md", "./scripts/pet-rollout-monitor.command --once --dry-run");
  checkTextContains("docs/public-repo-review-checklist.md", "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "privacy-first-say.env` uses OS speech with `auto` speech-language and no model download");
  checkTextContains("docs/public-repo-review-checklist.md", "generic-voicebox.env` uses a Voicebox-compatible endpoint in generic mode with profile `default` and language `en`");
  checkTextContains("docs/public-repo-review-checklist.md", "Run the sanitizer example for the OS being verified");
  checkTextContains("docs/public-repo-review-checklist.md", "before pasting any check, dry-run, installer, or TTS command output into a public issue");
  checkTextContains("docs/public-repo-review-checklist.md", "installer, platform check, dry-run, and audible TTS evidence");
  checkTextContains("docs/public-repo-review-checklist.md", "OS/version, CPU architecture, Node.js and npm versions");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:config");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:installers");
  checkTextContains("docs/public-repo-review-checklist.md", "macOS, Windows, and Linux installers");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:docs");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:pack");
  checkTextContains("docs/public-repo-review-checklist.md", "npm run check:sanitize");
  checkTextContains("docs/public-repo-review-checklist.md", "package-scope audit, not npm publish preparation");
  checkTextContains("docs/public-repo-review-checklist.md", "temporary npm cache");
  checkTextContains("docs/public-repo-review-checklist.md", "`package.json` should remain `private: true`");
  checkTextContains("docs/public-repo-review-checklist.md", "The only packaged `test/` files should be the known public rollout fixtures");
  checkTextContains("docs/public-repo-review-checklist.md", "ko-zh-rollout.jsonl");
  checkTextContains("docs/public-repo-review-checklist.md", "CI-only and fixture-only evidence can keep the repo release-ready");
  checkTextContains("docs/public-repo-review-checklist.md", "Public preview release is allowed before Windows / Linux audible TTS evidence");
  checkTextContains("docs/public-repo-review-checklist.md", "post-release evidence is collected through Platform verification issues");
  checkTextContains("docs/public-repo-review-checklist.md", "cannot graduate Windows or Linux without audible, sanitized real-device evidence");
  checkTextContains("docs/public-repo-review-checklist.md", "Korean / Chinese OS speech fallback");
  checkTextContains("docs/public-repo-review-checklist.md", "Quick Contributor Request");
  checkTextContains("docs/public-repo-review-checklist.md", "install, platform check, dry-run, one audible TTS command output");
  checkTextContains("docs/public-repo-review-checklist.md", "TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known");
  checkTextContains("docs/public-repo-review-checklist.md", "audible: yes");
  checkTextContains("docs/public-repo-review-checklist.md", "sanitized: yes");
  checkTextContains("docs/public-repo-review-checklist.md", "fixture compatibility");
  checkTextContains("docs/public-repo-review-checklist.md", "stateful Codex verification");
  checkTextContains("docs/public-repo-review-checklist.md", "If a real-device verifier has no local Codex state yet");
  checkTextContains("docs/public-repo-review-checklist.md", "supplemental fixture evidence");
  checkTextContains("docs/public-repo-review-checklist.md", "not as stateful Codex verification for platform graduation");
  checkTextContains("docs/public-repo-review-checklist.md", "OS/version, CPU architecture, Node.js and npm versions, installer, platform check, dry-run, and audible TTS evidence");
  checkTextContains("FUTURE_PLAN.md", "npm run check:pack");
  checkTextContains("FUTURE_PLAN.md", "npm run check:sanitize");
  checkTextContains("FUTURE_PLAN.md", "audible: yes");
  checkTextContains("FUTURE_PLAN.md", "sanitized: yes");
  checkTextContains("FUTURE_PLAN.md", "OS/version");
  checkTextContains("FUTURE_PLAN.md", "CPU architecture");
  checkTextContains("FUTURE_PLAN.md", "Node.js and npm versions");
  checkTextContains("FUTURE_PLAN.md", "TTS path tested");
  checkTextContains("FUTURE_PLAN.md", "speech-language value");
  checkTextContains("FUTURE_PLAN.md", "Codex Desktop / CLI version if known");
  checkTextContains("FUTURE_PLAN.md", "sanitized Platform verification issue link");
  checkTextContains("FUTURE_PLAN.md", "CI-only evidence, fixture-only dry-runs, `--no-state` compatibility, and package checks as release gates");
  checkTextContains("FUTURE_PLAN.md", "installer/check/dry-run/audible TTS script set");
  checkTextContains("FUTURE_PLAN.md", "npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/real-device-verification.md", "`check:pack`");
  checkTextContains("docs/real-device-verification.md", "`check:swift-cli`");
  checkTextContains("docs/real-device-verification.md", "fixture-only compatibility");
  checkTextContains("docs/verification-status.md", "macOS 26.5, arm64");
  checkTextContains("docs/verification-status.md", "Windows remains experimental");
  checkTextContains("docs/verification-status.md", "Linux remains experimental");
  checkTextContains("docs/verification-status.md", "CI-only evidence, fixture-only dry-runs, `npm run check:compat -- --no-state`, and package checks are release gates");
  checkTextContains("docs/verification-status.md", "not platform graduation evidence");
  checkTextContains("docs/verification-status.md", "TTS path tested");
  checkTextContains("docs/verification-status.md", "CPU architecture");
  checkTextContains("docs/verification-status.md", "Node.js and npm versions");
  checkTextContains("docs/verification-status.md", "speech-language value");
  checkTextContains("docs/verification-status.md", "config source");
  checkTextContains("docs/verification-status.md", "Codex Desktop / CLI version if known");
  checkTextContains("docs/verification-status.md", "audible: yes");
  checkTextContains("docs/verification-status.md", "sanitized: yes");
  checkTextContains("docs/verification-status.md", "npm run check:all");
  checkTextContains("docs/verification-status.md", "npm run check:compat");
  checkTextContains("docs/verification-status.md", "npm run check:audio:strict");
  checkTextContains("docs/verification-status.md", "npm run check:pack");
  checkTextContains("docs/verification-status.md", "npm run check:release");
  checkTextContains("docs/verification-status.md", "npm run check:sanitize");
  checkTextContains("docs/verification-status.md", "npm run test:dry-run");
  checkTextContains("docs/verification-status.md", "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl");
  checkTextContains("docs/verification-status.md", "A macOS `say` fixture TTS command is recorded as the current audible local TTS evidence");
  checkTextContains("docs/verification-status.md", "VOICEVOX Engine was not running during this snapshot");
  checkTextContains("docs/verification-status.md", "recorded audible TTS path is `macOS say`");
  checkTextContains("docs/verification-status.md", "Stateful dry-run output includes the local thread title, rollout path, and conversation text");
  checkTextContains("docs/verification-status.md", "must not be pasted publicly without sanitization and manual review");
  checkTextContains("docs/verification-status.md", "Release Evidence Draft");
  checkTextContains("docs/verification-status.md", "macOS 26.5 / arm64 / Node.js v24.2.0 / npm 11.6.4 / Codex CLI: 0.135.0 / TTS: macOS say / speech-language: auto / config source: none (.talking-pets.local.env absent) / audible: yes / sanitized: yes");
  checkTextContains("docs/verification-status.md", "Use these row templates only after a sanitized Platform verification issue passes the review");
  checkTextContains("docs/verification-status.md", "Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Windows OS speech|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes / sanitized: yes / Evidence link: <Platform verification issue>");
  checkTextContains("docs/verification-status.md", "Node.js <version> / npm <version> / Codex: <version|unknown> / TTS: Linux espeak|VOICEVOX|Kokoro.js|Voicebox-compatible endpoint|Other local TTS / speech-language: auto|ja|en|ko|zh|other / config source: <installer default|preset|custom|none> / audible: yes / sanitized: yes / Evidence link: <Platform verification issue>");
  checkTextContains("docs/verification-status.md", "When Evidence Arrives");
  checkTextContains("docs/verification-status.md", "Before changing Windows or Linux status");
  checkTextContains("docs/verification-status.md", "published as a macOS stable / Windows and Linux experimental public preview");
  checkTextContains("docs/verification-status.md", "Collect that post-release evidence through sanitized Platform verification issues");
  checkTextContains("docs/verification-status.md", "install, platform check, dry-run, and one audible TTS command output");
  checkTextContains("docs/verification-status.md", "not a private log, local file, archive, or chat transcript");
  checkTextContains("docs/verification-status.md", "After the review passes, update this page first");
  checkTextContains("docs/verification-status.md", "Update this file whenever a platform status changes");
  checkTextContains("docs/verification-status.md", "Keep Windows and Linux marked experimental until sanitized, audible real-device evidence exists for each OS");
  checkTextContains("docs/verification-status.md", "Platform verification");
  checkTextContains("scripts/check-config-files.mjs", "allowedEnvKeys");
  checkTextContains("scripts/check-config-files.mjs", "validateEnvValues");
  checkTextContains("scripts/check-config-files.mjs", "expectedUILanguage: \"en\"");
  checkTextContains("scripts/check-config-files.mjs", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("scripts/check-config-files.mjs", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains("scripts/check-config-files.mjs", "allowMissingSpeechLanguage");
  checkTextContains("scripts/check-config-files.mjs", "ko: \"say\"");
  checkTextContains("scripts/check-config-files.mjs", "zh: \"say\"");
  checkTextContains("scripts/check-config-files.mjs", "generic-voicebox.env");
  checkTextContains("scripts/check-config-files.mjs", "ko-say-fallback.env");
  checkTextContains("scripts/check-config-files.mjs", "zh-say-fallback.env");
  checkTextContains("scripts/check-config-files.mjs", "expectedVoiceboxProfile");
  checkTextContains("scripts/check-config-files.mjs", "expectedVoiceboxLanguage");
  checkTextContains("scripts/check-config-files.mjs", "checkLauncherConfigKeys");
  checkTextContains("scripts/check-config-files.mjs", "install.command");
  checkTextContains("scripts/check-config-files.mjs", "install.sh");
  checkTextContains("scripts/check-config-files.mjs", "install.ps1");
  checkTextContains("scripts/check-config-files.mjs", "must be a valid http(s) URL");
  checkTextContains("scripts/check-installer-configs.mjs", "macOS installer voicebox config");
  checkTextContains("scripts/check-installer-configs.mjs", "Linux installer voicebox config");
  checkTextContains("scripts/check-installer-configs.mjs", "Linux installer say config");
  checkTextContains("scripts/check-installer-configs.mjs", "PowerShell installer voicebox config");
  checkTextContains("scripts/check-installer-configs.mjs", "PowerShell installer say config");
  checkTextContains("scripts/check-installer-configs.mjs", "validateEnvValues");
  checkTextContains("scripts/check-installer-configs.mjs", "TALKING_PETS_VOICEBOX_MODE");
  checkTextContains("scripts/check-installer-configs.mjs", "TALKING_PETS_VOICEVOX_SPEAKER");
  checkTextContains("scripts/check-installer-configs.mjs", "TALKING_PETS_KOKORO_VOICE");
  checkTextContains("scripts/check-installer-configs.mjs", "TALKING_PETS_SAY_VOICE");
  checkTextContains("scripts/check-installer-configs.mjs", "generated env keys");
  checkTextContains("scripts/check-installer-configs.mjs", "requiredInstallerIssues");
  checkTextContains("scripts/check-installer-configs.mjs", "installerOutputIssues");
  checkTextContains("scripts/check-installer-configs.mjs", "Saved config: .talking-pets.local.env");
  checkTextContains("test/monitor.test.mjs", "requires installer config checks on their native platforms");
  checkTextContains("test/monitor.test.mjs", "keeps installer output safe for public evidence");
  checkTextContains("test/monitor.test.mjs", "validates local env values before startup");
  checkTextContains("scripts/pet-rollout-monitor.mjs", "--tts auto|voicevox|voicebox|kokoro|irodori|say");
  checkTextContains("scripts/pet-rollout-monitor.swift", "choiceValue(\"--tts\"");
  checkTextContains("scripts/pet-rollout-monitor.swift", "choiceValue(\"--speech-language\"");
  checkTextContains("scripts/pet-rollout-monitor.mjs", "\"zh\"");
  checkTextContains("scripts/pet-rollout-monitor.mjs", "\"ko\"");
  checkTextContains("scripts/pet-rollout-monitor.swift", "\"zh\"");
  checkTextContains("scripts/pet-rollout-monitor.swift", "\"ko\"");
  checkTextContains("scripts/pet-rollout-monitor.swift", "positiveTimeIntervalValue(\"--interval\"");
  checkTextContains("scripts/pet-rollout-monitor.swift", "positiveIntValue(\"--max-source-chars\"");
  checkTextContains("scripts/pet-rollout-monitor.swift", "func die(_ message: String) -> Never");
  checkTextDoesNotContain("scripts/pet-rollout-monitor.swift", "fatalError(");
  checkTextContains("scripts/check-swift-cli.mjs", "Stack dump");
  checkTextContains("scripts/check-swift-cli.mjs", "--tts must be one of");
  checkTextContains("scripts/check-swift-cli.mjs", "--speech-language must be one of: auto, ja, en, ko, zh, other");
  checkTextContains("scripts/check-swift-cli.mjs", "--voice requires a value");
  checkTextContains("scripts/check-swift-cli.mjs", "assertSwiftSuccess");
  checkTextContains("scripts/check-platform-scripts.mjs", "platformChecks");
  checkTextContains("scripts/check-platform-scripts.mjs", "install.sh");
  checkTextContains("scripts/check-platform-scripts.mjs", "check-swift-cli.mjs");
  checkTextContains("scripts/check-platform-scripts.mjs", "windowsPowerShellCommand");
  checkTextContains("scripts/check-platform-scripts.mjs", "PowerShell scripts (available)");
  checkTextContains("scripts/audio-platform.mjs", "pwsh");
  checkTextContains("scripts/check-npm-pack.mjs", "packIssues");
  checkTextContains("scripts/check-npm-pack.mjs", "npm pack scope: ok");
  checkTextContains("scripts/check-npm-pack.mjs", "packageDocumentLinkIssues");
  checkTextContains("scripts/check-markdown-links.mjs", "documentAnchors");
  checkTextContains("scripts/check-markdown-links.mjs", "[broken-anchor]");
  checkTextContains("scripts/check-npm-pack.mjs", "document link missing packaged target");
  checkTextContains("scripts/check-npm-pack.mjs", "missing packaged anchor");
  checkTextContains("scripts/check-npm-pack.mjs", "document link escapes package");
  checkTextContains("scripts/check-npm-pack.mjs", "SQLite DB");
  checkTextContains("scripts/check-npm-pack.mjs", "macOS metadata");
  checkTextContains("scripts/check-npm-pack.mjs", "private rollout JSONL");
  checkTextContains("scripts/check-npm-pack.mjs", "local experimental folder");
  checkTextContains("scripts/check-npm-pack.mjs", "dependency folder");
  checkTextContains("scripts/check-npm-pack.mjs", "docs/public-repo-review-checklist.md");
  checkTextContains("scripts/check-npm-pack.mjs", "docs/verification-status.md");
  checkTextContains("scripts/check-npm-pack.mjs", "shouldUseShellForNPM");
  checkTextContains("scripts/check-npm-pack.mjs", "shouldCheckExecutableMode");
  checkTextContains("scripts/check-npm-pack.mjs", "CHANGELOG.md");
  checkTextContains("scripts/check-npm-pack.mjs", "install.sh");
  checkTextContains("scripts/check-npm-pack.mjs", "CONTRIBUTING.md");
  checkTextContains("scripts/check-npm-pack.mjs", "FUTURE_PLAN.md");
  checkTextContains("scripts/check-npm-pack.mjs", "SECURITY.md");
  checkTextContains("scripts/check-npm-pack.mjs", "ja-voicevox-zundamon.env");
  checkTextContains("scripts/check-npm-pack.mjs", "presets/voices.json");
  checkTextContains("scripts/check-npm-pack.mjs", "scripts/sanitize-public-output.mjs");
  checkTextContains("scripts/check-npm-pack.mjs", "scripts/check-public-output-sanitizer.mjs");
  checkTextContains("scripts/check-release-readiness.mjs", "packageLockIssues");
  checkTextContains("test/monitor.test.mjs", "selects platform script checks by OS");
  checkTextContains("test/monitor.test.mjs", "detects npm pack scope drift");
  checkTextContains("test/monitor.test.mjs", "CONTRIBUTING.md#issues");
  checkTextContains("test/monitor.test.mjs", "missing packaged anchor");
  checkTextContains("test/monitor.test.mjs", "detects package-lock root metadata drift");
  checkTextContains("test/monitor.test.mjs", "detects unsafe local config failure log drift");
  checkTextContains("test/monitor.test.mjs", "中文语音确认");
  checkTextContains("test/monitor.test.mjs", "keeps multilingual rollout fixtures");
  checkTextContains("test/fixtures/ko-zh-rollout.jsonl", "한국어 확인");
  checkTextContains("test/fixtures/ko-zh-rollout.jsonl", "中文语音确认");
  checkTextContains("test/monitor.test.mjs", "packageIssues");
  checkTextContains("test/monitor.test.mjs", "workflowIssues");
  checkTextDoesNotContain("check.command", "source \"$CONFIG_FILE\"");
  checkTextDoesNotContain("start-selected-tts.command", "source \"$CONFIG_FILE\"");
  checkTextDoesNotContain("check.sh", "source \"$CONFIG_FILE\"");
  checkTextDoesNotContain("start-selected-tts.sh", "source \"$CONFIG_FILE\"");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Was one spoken line audible?");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Share real-device install, platform check, dry-run, and audible TTS evidence");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Codex Desktop / CLI version if known");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Speech-language value");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Config source");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "macOS say");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Windows OS speech");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Linux espeak");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "ko/zh fallback used Linux espeak");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "./check.sh");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "npm run check:swift-cli");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "npm run test:dry-run");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "local env values");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "model files");
  checkTextContains(".github/pull_request_template.md", "npm run check:all");
  checkTextContains(".github/pull_request_template.md", "npm run test:dry-run");
  checkTextContains(".github/pull_request_template.md", "npm run check:installers");
  checkTextContains(".github/pull_request_template.md", "npm run check:swift-cli");
  checkTextContains(".github/pull_request_template.md", "npm run check:sanitize");
  checkTextContains(".github/pull_request_template.md", "public-output redaction");
  checkTextContains("CHANGELOG.md", "0.1.0");
  checkTextContains("CHANGELOG.md", "TALKING_PETS_SPEECH_LANGUAGE=\"auto\"");
  checkTextContains("CHANGELOG.md", "-SpeechLanguage auto|ja|en|ko|zh|other");
  checkTextContains("CHANGELOG.md", "npm run check:installers");
  checkTextContains("CHANGELOG.md", "install.sh");
  checkTextContains("CHANGELOG.md", "experimental Linux usage");
  checkTextContains("FUTURE_PLAN.md", "npm run check:installers");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "install.sh");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "Node.js and npm versions");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "node v22.x.x, npm x.x.x");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "Speech-language value if audio-related");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "Config source if audio-related");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "npm ci");
  checkTextDoesNotContain(".github/ISSUE_TEMPLATE/install_trouble.yml", "npm install");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "npm run sanitize:public-output");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "npm run sanitize:public-output");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "npm run sanitize:public-output");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "Node.js and npm versions");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "node v22.x.x, npm x.x.x");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "Speech-language value if audio-related");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "Config source if audio-related");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "TALKING_PETS_SPEECH_LANGUAGE");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "Voicebox-compatible endpoint");
  checkTextContains(".github/ISSUE_TEMPLATE/bug_report.yml", "Other local TTS");
  checkTextContains(".github/ISSUE_TEMPLATE/platform_verification.yml", "Voicebox-compatible endpoint");
  checkTextContains(".github/ISSUE_TEMPLATE/install_trouble.yml", "Voicebox endpoint check");

  if (failures > 0) {
    console.error(`release readiness: failed (${failures} issue${failures === 1 ? "" : "s"})`);
    process.exit(1);
  }

  console.log("release readiness: ok");
}

function checkPlatformGraduationBoundaries() {
  for (const [file, text] of platformGraduationBoundaryChecks) {
    checkTextContains(file, text);
  }
}

if (process.argv[1] === scriptPath) {
  main();
}

function assertExists(file) {
  const path = join(root, file);
  if (!existsSync(path)) {
    fail(`missing required file: ${file}`);
  }
}

function assertAbsent(file) {
  const path = join(root, file);
  if (existsSync(path)) {
    fail(`forbidden stale file still exists: ${file}`);
  }
}

function assertExecutable(file) {
  const path = join(root, file);
  if (!existsSync(path)) {
    fail(`missing executable file: ${file}`);
    return;
  }
  if (process.platform === "win32") return;
  const mode = statSync(path).mode;
  if ((mode & 0o111) === 0) {
    fail(`not executable: ${file}`);
  }
}

function checkForbiddenArtifacts() {
  for (const file of listFiles(root)) {
    const label = forbiddenArtifactLabel(file);
    if (label) fail(`forbidden ${label} in repo: ${file}`);
  }
}

function checkForbiddenPublicText() {
  for (const file of listFiles(root)) {
    if (statSync(join(root, file)).isDirectory()) continue;
    if (isBinaryLikeFile(file)) continue;
    const content = readText(file);
    for (const rule of forbiddenPublicTextRules) {
      if (content.includes(rule.pattern)) {
        fail(`forbidden ${rule.label} in public text: ${file}`);
      }
    }
  }
}

function checkGitHubTemplates() {
  const issueTemplates = [
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/install_trouble.yml",
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
  ];
  const templateTexts = new Map();
  for (const file of issueTemplates) {
    const content = readText(file);
    templateTexts.set(file, content);
  }

  const pr = readText(".github/pull_request_template.md");
  for (const message of githubTemplateIssues(templateTexts, pr)) {
    fail(message);
  }
}

function githubTemplateIssues(templateTexts, pr) {
  const issues = [];
  for (const [file, content] of templateTexts) {
    if (!content) continue;
    for (const key of ["name:", "description:", "title:", "labels:", "body:"]) {
      if (!content.includes(key)) issues.push(`${file} missing ${key}`);
    }
    if (!/\n\s+- type: /.test(content)) issues.push(`${file} has no issue form fields`);
    if (!/\n\s+id: /.test(content)) issues.push(`${file} has no issue form field ids`);
    if (!/\n\s+attributes:/.test(content)) issues.push(`${file} has no issue form attributes`);
    if (!/\n\s+validations:/.test(content)) issues.push(`${file} has no issue form validations`);
  }

  const requiredLabels = new Map([
    [".github/ISSUE_TEMPLATE/bug_report.yml", ["bug"]],
    [".github/ISSUE_TEMPLATE/install_trouble.yml", ["install"]],
    [".github/ISSUE_TEMPLATE/platform_verification.yml", ["verification"]],
    [".github/ISSUE_TEMPLATE/tts_provider_request.yml", ["enhancement", "tts"]],
  ]);
  for (const [file, labels] of requiredLabels) {
    const content = templateTexts.get(file) ?? "";
    for (const label of labels) {
      if (!issueTemplateHasLabel(content, label)) issues.push(`${file} missing issue label: ${label}`);
    }
  }

  const requiredFieldIds = new Map([
    [".github/ISSUE_TEMPLATE/bug_report.yml", ["os", "arch", "node", "codex_version", "speech_language", "config_source", "tts", "commands", "expected", "actual"]],
    [".github/ISSUE_TEMPLATE/install_trouble.yml", ["os", "arch", "node", "codex_version", "speech_language", "config_source", "check_output", "audio_check", "blocker"]],
    [".github/ISSUE_TEMPLATE/platform_verification.yml", ["platform", "os", "arch", "node", "codex_version", "tts", "speech_language", "config_source", "commands", "sanitized", "audible", "notes"]],
    [".github/ISSUE_TEMPLATE/tts_provider_request.yml", ["provider", "platform", "languages", "requirements", "api", "terms", "privacy"]],
  ]);
  for (const [file, fieldIds] of requiredFieldIds) {
    const content = templateTexts.get(file) ?? "";
    for (const fieldId of fieldIds) {
      if (!content.includes(`id: ${fieldId}`)) issues.push(`${file} missing issue form field id: ${fieldId}`);
    }
  }

  const requiredTrueFieldIds = new Map([
    [".github/ISSUE_TEMPLATE/bug_report.yml", ["os", "arch", "node", "tts", "commands", "expected", "actual"]],
    [".github/ISSUE_TEMPLATE/install_trouble.yml", ["os", "arch", "node", "check_output", "blocker"]],
    [".github/ISSUE_TEMPLATE/platform_verification.yml", ["platform", "os", "arch", "node", "tts", "speech_language", "config_source", "commands", "sanitized", "audible"]],
    [".github/ISSUE_TEMPLATE/tts_provider_request.yml", ["provider", "platform", "languages", "requirements", "api", "terms", "privacy"]],
  ]);
  for (const [file, fieldIds] of requiredTrueFieldIds) {
    const content = templateTexts.get(file) ?? "";
    for (const fieldId of fieldIds) {
      if (!issueFieldBlock(content, fieldId).includes("required: true")) {
        issues.push(`${file} issue form field must be required: ${fieldId}`);
      }
    }
  }

  for (const file of [
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/install_trouble.yml",
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
  ]) {
    const content = templateTexts.get(file) ?? "";
    for (const text of ["Remove private", "conversation text", "local env values", "credentials", "local SQLite DBs", "state_5.sqlite", "private rollout JSONL", "generated audio", "local recordings", "archives", "macOS metadata", "downloaded model files", "Known public fixture rollout paths may remain visible as evidence"]) {
      if (!content.includes(text)) issues.push(`${file} missing privacy guidance: ${text}`);
    }
  }

  const ttsRequest = templateTexts.get(".github/ISSUE_TEMPLATE/tts_provider_request.yml") ?? "";
  for (const text of ["Languages and voices", "Japanese / English / Korean / Chinese", "Install and runtime requirements", "required apps, CLI packages, model downloads, local servers", "Do not include credentials", "API keys", "private endpoint URLs", "private conversation text", "npm run sanitize:public-output", "Offline and privacy behavior", "downloads model files", "sends conversation text"]) {
    if (!ttsRequest.includes(text)) issues.push(`.github/ISSUE_TEMPLATE/tts_provider_request.yml missing privacy guidance: ${text}`);
  }

  const bugReport = templateTexts.get(".github/ISSUE_TEMPLATE/bug_report.yml") ?? "";
  const bugReportTTSField = issueFieldBlock(bugReport, "tts");
  for (const option of ["auto", "VOICEVOX", "Kokoro.js", "Voicebox-compatible endpoint", "Other local TTS", "OS speech", "browser demo"]) {
    if (!bugReportTTSField.includes(`- ${option}`)) {
      issues.push(`.github/ISSUE_TEMPLATE/bug_report.yml missing tts option: ${option}`);
    }
  }

  const platformVerification = templateTexts.get(".github/ISSUE_TEMPLATE/platform_verification.yml") ?? "";
  const platformTTSField = issueFieldBlock(platformVerification, "tts");
  for (const option of ["macOS say", "Windows OS speech", "Linux espeak", "VOICEVOX", "Kokoro.js", "Voicebox-compatible endpoint", "Other local TTS"]) {
    if (!platformTTSField.includes(`- ${option}`)) {
      issues.push(`.github/ISSUE_TEMPLATE/platform_verification.yml missing tts option: ${option}`);
    }
  }
  for (const text of [
    "Share real-device install, platform check, dry-run, and audible TTS evidence",
    "id: speech_language",
    "label: Speech-language value",
    "TALKING_PETS_SPEECH_LANGUAGE",
    "id: config_source",
    "label: Config source",
    "installer default / presets/examples/privacy-first-say.env / custom",
    "id: codex_version",
    "Codex Desktop / CLI version if known",
    "macOS say",
    "Windows OS speech",
    "Linux espeak",
    "id: sanitized",
    "label: Public evidence sanitized?",
    "Confirm every pasted command output",
    "copied into release evidence as `sanitized: yes`",
    "npm run sanitize:public-output",
    "do not link unsanitized evidence from release notes",
    "local recordings",
    "archives",
    "credentials",
    "macOS metadata",
    "A \"No\" result can track follow-up work",
    "copied into release evidence as `audible: yes`",
    "CI-only, fixture-only, `--no-state`, and package-check output are release gates only",
    "not evidence for graduating Windows or Linux from experimental without audible, sanitized real-device output",
    "A \"Yes\" result must correspond to audible real-device output",
    "If the machine has no local Codex state yet",
    "npm run check:compat -- --no-state",
    "no local Codex state yet so check:compat was recorded as a limitation",
  ]) {
    if (!platformVerification.includes(text)) {
      issues.push(`.github/ISSUE_TEMPLATE/platform_verification.yml missing verification field: ${text}`);
    }
  }

  if (pr) {
    for (const text of [
      "npm run check:all",
      "npm run test:dry-run",
      "npm ci",
      "npm run check:compat",
      "npm run check:platform-scripts",
      "npm run check:pack",
      "npm run check:release",
      "README.md",
      "README.en.md",
      "CHANGELOG.md",
      "implementation-notes.md",
      "docs/verification-status.md",
      "No Codex Desktop patching",
      "No bundled VOICEVOX app",
      "downloaded model files",
      "generated audio",
      "private rollout JSONL",
      "local recordings",
      "archives",
      "macOS metadata",
      "local env files",
      "local SQLite DBs",
      "docs/real-device-verification.md",
      "Evidence includes install, platform check, dry-run, and one audible TTS command output",
      "TTS path tested, speech-language value, config source, and Codex Desktop / CLI version if known",
      "Linked from a sanitized Platform verification issue for release notes",
      "sanitized: yes",
      "audible: yes",
      "Public evidence sanitization is confirmed as `sanitized: yes` before linking from release notes",
      "Platform status changes use only evidence with `audible: yes` and one spoken line",
      "CI-only, fixture-only, `--no-state`, and package-check output are treated as release gates",
      "not Windows / Linux graduation evidence",
    ]) {
      if (!pr.includes(text)) issues.push(`.github/pull_request_template.md missing ${text}`);
    }
  }

  return issues;
}

function checkWorkflow() {
  const workflow = readText(".github/workflows/ci.yml");
  if (!workflow) return;

  for (const message of workflowIssues(workflow)) {
    fail(message);
  }
}

function workflowIssues(workflow) {
  const issues = [];
  for (const os of ["ubuntu-latest", "macos-latest", "windows-latest"]) {
    if (!workflow.includes(os)) issues.push(`.github/workflows/ci.yml missing matrix OS ${os}`);
  }

  for (const command of [
    "npm install -g npm@11.6.4",
    "npm --version",
    "npm ci",
    "npm run check:syntax",
    "npm run check:runtime",
    "npm test",
    "npm run check:compat -- --no-state",
    "npm run check:audio",
    "npm run check:config",
    "npm run check:installers",
    "npm run check:docs",
    "npm run check:platform-scripts",
    "npm run check:swift-cli",
    "npm run check:pack",
    "npm run check:release",
    "npm run check:all",
    "npm run check:sanitize",
    "npm run test:dry-run",
    "zsh -n install.command check.command start-selected-tts.command scripts/pet-rollout-monitor.command scripts/pet-rollout-monitor-node.command",
    "bash -n install.sh check.sh start-selected-tts.sh",
    "swift -frontend -parse scripts/pet-rollout-monitor.swift",
    "npm run check:swift-cli",
  ]) {
    if (!workflow.includes(command)) issues.push(`.github/workflows/ci.yml missing command ${command}`);
  }

  for (const text of [
    "runner.os != 'Windows'",
    "runner.os == 'Windows'",
    "runner.os == 'macOS'",
    "Use pinned npm",
    "Show package manager versions",
    "Check public output sanitizer",
    "Parse zsh scripts",
    "Parse bash scripts",
    "[System.Management.Automation.PSParser]::Tokenize",
  ]) {
    if (!workflow.includes(text)) issues.push(`.github/workflows/ci.yml missing ${text}`);
  }
  return issues;
}

function forbiddenArtifactLabel(file) {
  return forbiddenArtifactRules.find(rule => rule.test(file))?.label ?? null;
}

function isForbiddenEnvFile(file) {
  if (!file.endsWith(".env") && !file.includes(".env.")) return false;
  if (file === ".talking-pets.local.env.example") return false;
  if (file.startsWith("presets/examples/") && file.endsWith(".env")) return false;
  return true;
}

function listFiles(dir, prefix = "") {
  const result = [];
  for (const entry of readdirSync(dir)) {
    if (entry === ".git" || entry === "node_modules") continue;
    const rel = prefix ? `${prefix}/${entry}` : entry;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      result.push(rel, ...listFiles(path, rel));
    } else {
      result.push(rel);
    }
  }
  return result;
}

function isBinaryLikeFile(file) {
  return /\.(png|jpg|jpeg|gif|webp|mov|mp4|webm|mkv|ico)$/i.test(file);
}

function checkPackageJSON() {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  } catch (error) {
    fail(`package.json is not parseable JSON: ${error.message}`);
    return;
  }

  for (const message of packageIssues(pkg)) {
    fail(message);
  }
}

function checkPackageLock() {
  let pkg;
  let lock;
  try {
    pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  } catch (error) {
    fail(`package.json is not parseable JSON: ${error.message}`);
    return;
  }

  try {
    lock = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));
  } catch (error) {
    fail(`package-lock.json is not parseable JSON: ${error.message}`);
    return;
  }

  for (const message of packageLockIssues(pkg, lock)) {
    fail(message);
  }
}

function packageIssues(pkg) {
  const issues = [];
  if (pkg.private !== true) issues.push("package.json private must remain true until npm publication is intentional");
  if (pkg.license !== "MIT") issues.push("package.json license must be MIT");
  if (pkg.packageManager !== "npm@11.6.4") issues.push("package.json packageManager must remain npm@11.6.4 for clean install evidence");
  if (!pkg.repository?.url) issues.push("package.json repository.url is required");
  const requiredPackageFiles = [
    ".talking-pets.local.env.example",
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
    "presets/",
    "scripts/",
    "src/",
    "start-selected-tts.command",
    "start-selected-tts.ps1",
    "start-selected-tts.sh",
    "test/fixtures/assistant-rollout.jsonl",
    "test/fixtures/mixed-ja-en-rollout.jsonl",
    "test/fixtures/ko-zh-rollout.jsonl",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "CREDITS.md",
    "FUTURE_PLAN.md",
    "LICENSE",
    "README.md",
    "README.en.md",
    "SECURITY.md",
  ];
  if (!Array.isArray(pkg.files)) {
    issues.push("package.json files allowlist is required");
  } else {
    for (const file of requiredPackageFiles) {
      if (!pkg.files.includes(file)) issues.push(`package.json files must include ${file}`);
    }
    for (const forbidden of [".github/", "test/", "test/monitor.test.mjs", "implementation-notes.md", "docs/demo/talking-pets-overlay-2026-05-28.mov"]) {
      if (pkg.files.includes(forbidden)) issues.push(`package.json files must not include ${forbidden}`);
    }
  }
  if (!pkg.dependencies?.["@huggingface/transformers"]) {
    issues.push("package.json dependencies.@huggingface/transformers is required because scripts/tts-kokoro.mjs imports it directly");
  }
  if (!pkg.dependencies?.["kokoro-js"]) issues.push("package.json dependencies.kokoro-js is required");
  const requiredScripts = [
    "check:syntax",
    "check:runtime",
    "check:compat",
    "check:audio",
    "check:audio:strict",
    "check:config",
    "check:installers",
    "check:docs",
    "check:release",
    "check:swift-cli",
    "check:platform-scripts",
    "check:pack",
    "check:sanitize",
    "check:all",
    "test",
    "test:dry-run",
    "sanitize:public-output",
    "monitor:node",
    "tts:kokoro",
    "tts:voicebox",
    "tts:voicevox",
  ];
  for (const script of requiredScripts) {
    if (!pkg.scripts?.[script]) issues.push(`package.json scripts.${script} is required`);
  }

  const requiredCheckAllCommands = [
    "npm run check:syntax",
    "npm run check:runtime",
    "npm test",
    "npm run check:compat -- --no-state",
    "npm run check:audio",
    "npm run check:config",
    "npm run check:installers",
    "npm run check:docs",
    "npm run check:platform-scripts",
    "npm run check:swift-cli",
    "npm run check:pack",
    "npm run check:release",
    "npm run check:sanitize",
    "npm run test:dry-run",
  ];
  for (const command of requiredCheckAllCommands) {
    if (!pkg.scripts?.["check:all"]?.includes(command)) {
      issues.push(`package.json scripts.check:all must include ${command}`);
    }
  }

  const syntaxCheckedFiles = [
    "scripts/audio-platform.mjs",
    "src/talking-pet-mvp.js",
    "scripts/pet-rollout-monitor.mjs",
    "scripts/tts-kokoro.mjs",
    "scripts/tts-voicebox.mjs",
    "scripts/check-node-runtime.mjs",
    "scripts/check-codex-compat.mjs",
    "scripts/check-audio-path.mjs",
    "scripts/check-config-files.mjs",
    "scripts/check-installer-configs.mjs",
    "scripts/check-markdown-links.mjs",
    "scripts/check-public-output-sanitizer.mjs",
    "scripts/check-release-readiness.mjs",
    "scripts/check-swift-cli.mjs",
    "scripts/check-platform-scripts.mjs",
    "scripts/check-npm-pack.mjs",
    "scripts/sanitize-public-output.mjs",
  ];
  for (const file of syntaxCheckedFiles) {
    if (!pkg.scripts?.["check:syntax"]?.includes(`node --check ${file}`)) {
      issues.push(`package.json scripts.check:syntax must include node --check ${file}`);
    }
  }
  return issues;
}

function packageLockIssues(pkg, lock) {
  const issues = [];
  if (lock.name !== pkg.name) issues.push("package-lock.json name must match package.json name");
  if (lock.version !== pkg.version) issues.push("package-lock.json version must match package.json version");
  if (lock.lockfileVersion !== 3) issues.push("package-lock.json lockfileVersion must remain 3");
  if (lock.requires !== true) issues.push("package-lock.json requires must be true");

  const rootPackage = lock.packages?.[""];
  if (!rootPackage) {
    issues.push('package-lock.json packages[""] root metadata is required');
    return issues;
  }

  for (const key of ["name", "version", "license"]) {
    if (rootPackage[key] !== pkg[key]) {
      issues.push(`package-lock.json root ${key} must match package.json ${key}`);
    }
  }

  if (rootPackage.engines?.node !== pkg.engines?.node) {
    issues.push("package-lock.json root engines.node must match package.json engines.node");
  }

  const packageDependencies = pkg.dependencies ?? {};
  const lockDependencies = rootPackage.dependencies ?? {};
  for (const [name, version] of Object.entries(packageDependencies)) {
    if (lockDependencies[name] !== version) {
      issues.push(`package-lock.json root dependency ${name} must match package.json`);
    }
  }
  for (const name of Object.keys(lockDependencies)) {
    if (!Object.hasOwn(packageDependencies, name)) {
      issues.push(`package-lock.json root dependency ${name} is not in package.json dependencies`);
    }
  }

  return issues;
}

function releaseEvidenceIssues(docs, packageScripts = null) {
  const issues = [];
  const requiredCommands = [
    "npm ci",
    "npm run check:all",
    "npm run check:compat",
    "npm run check:runtime",
    "npm run check:audio:strict",
    "npm run check:config",
    "npm run check:installers",
    "npm run check:docs",
    "npm run check:platform-scripts",
    "npm run check:swift-cli",
    "npm run check:pack",
    "npm run check:release",
    "npm run check:sanitize",
    "npm run test:dry-run",
    "npm run sanitize:public-output",
  ];
  const requiredDocumentCommands = {
    "docs/release-notes-template.md": [
      "./scripts/pet-rollout-monitor.command --once --dry-run",
      "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl",
      { command: "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl", count: 2 },
      { command: "npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl", count: 2 },
      "npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl",
      "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl",
    ],
    "docs/real-device-verification.md": [
      "./scripts/pet-rollout-monitor.command --once --dry-run",
      "./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl",
      { command: "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl", count: 2 },
      { command: "npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl", count: 2 },
      "npm run monitor:node -- --tts say --speech-language ko --once --rollout test/fixtures/ko-zh-rollout.jsonl",
      "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl",
    ],
  };
  for (const [file, content] of docs) {
    for (const command of requiredCommands) {
      if (!content.includes(command)) issues.push(`${file} missing release evidence command: ${command}`);
    }
    if (file === "docs/release-notes-template.md" && !content.includes("sanitized: yes|no")) {
      issues.push(`${file} missing release evidence marker: sanitized: yes|no`);
    }
    if (file === "docs/release-notes-template.md" && !content.includes("config source: <installer default|preset|custom|none>")) {
      issues.push(`${file} missing release evidence marker: config source`);
    }
    if (file === "docs/release-notes-template.md" && !content.includes("no local Codex state")) {
      issues.push(`${file} missing release evidence limitation: no local Codex state`);
    }
    if (
      (file === "docs/release-notes-template.md" || file === "docs/real-device-verification.md")
      && !content.includes("OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known")
    ) {
      issues.push(`${file} missing release evidence limitation: full Windows / Linux graduation evidence fields`);
    }
    if ((file === "docs/release-notes-template.md" || file === "docs/real-device-verification.md") && !content.includes("sanitized Platform verification issue link")) {
      issues.push(`${file} missing release evidence limitation: sanitized Platform verification issue link`);
    }
    for (const required of requiredDocumentCommands[file] ?? []) {
      const command = typeof required === "string" ? required : required.command;
      const count = typeof required === "string" ? 1 : required.count;
      if (occurrenceCount(content, command) < count) {
        issues.push(`${file} missing platform evidence command: ${command}`);
      }
    }
  }
  if (packageScripts) {
    for (const command of requiredCommands) {
      const script = npmRunScriptName(command);
      if (script && !packageScripts[script]) {
        issues.push(`package.json scripts.${script} is required by release evidence command ${command}`);
      }
    }
    for (const [file, content] of docs) {
      for (const script of npmRunScriptNamesInText(content)) {
        if (!packageScripts[script]) {
          issues.push(`${file} references missing package.json script: ${script}`);
        }
      }
    }
  }
  return issues;
}

function npmRunReferenceIssues(docs, packageScripts) {
  const issues = [];
  for (const [file, content] of docs) {
    for (const script of npmRunScriptNamesInText(content)) {
      if (!packageScripts?.[script]) {
        issues.push(`${file} references missing package.json script: ${script}`);
      }
    }
  }
  return issues;
}

function localConfigFailureLogIssues(scripts) {
  const issues = [];
  const rules = [
    {
      file: "check.command",
      required: [
        "unsupported key",
        "config: invalid format (.talking-pets.local.env)",
        "invalid line: $line_number",
        "redact_endpoint_for_log",
        "<redacted endpoint>",
      ],
      forbidden: [
        "config: invalid format ($CONFIG_FILE)",
        "invalid line: $line\"",
        "source \"$CONFIG_FILE\"",
      ],
    },
    {
      file: "start-selected-tts.command",
      required: [
        "設定ファイルの形式が不正です: .talking-pets.local.env",
        "問題の行番号: $line_number",
      ],
      forbidden: [
        "設定ファイルの形式が不正です: $CONFIG_FILE",
        "問題の行: $line",
        "source \"$CONFIG_FILE\"",
      ],
    },
    {
      file: "check.ps1",
      required: [
        "config: invalid format (.talking-pets.local.env)",
        "invalid line: $LineNumber",
        "Format-EndpointForLog",
        "<redacted endpoint>",
      ],
      forbidden: [
        "config: invalid format ($Config)",
      ],
    },
    {
      file: "start-selected-tts.ps1",
      required: [
        "Invalid config format: .talking-pets.local.env",
        "line $LineNumber",
      ],
      forbidden: [
        "Invalid config format: $Config",
      ],
    },
    {
      file: "check.sh",
      required: [
        "unsupported key",
        "config: invalid format (.talking-pets.local.env)",
        "invalid line: $line_number",
        "redact_endpoint_for_log",
        "<redacted endpoint>",
      ],
      forbidden: [
        "config: invalid format ($CONFIG_FILE)",
        "invalid line: $line\"",
        "source \"$CONFIG_FILE\"",
      ],
    },
    {
      file: "start-selected-tts.sh",
      required: [
        "Invalid config format: .talking-pets.local.env",
        "Invalid line number: $line_number",
      ],
      forbidden: [
        "Invalid config format: $CONFIG_FILE",
        "Invalid line: $line",
        "source \"$CONFIG_FILE\"",
      ],
    },
  ];

  for (const { file, required, forbidden } of rules) {
    const content = scripts.get(file);
    if (content == null) {
      issues.push(`${file} missing from local config failure log checks`);
      continue;
    }
    for (const text of required) {
      if (!content.includes(text)) issues.push(`${file} missing safe local config failure log: ${text}`);
    }
    for (const text of forbidden) {
      if (content.includes(text)) issues.push(`${file} must not leak local config failure detail: ${text}`);
    }
  }
  return issues;
}

function occurrenceCount(content, needle) {
  if (needle.length === 0) return 0;
  return content.split(needle).length - 1;
}

function npmRunScriptName(command) {
  const match = /^npm run ([A-Za-z0-9:_-]+)/.exec(command);
  return match ? match[1] : null;
}

function npmRunScriptNamesInText(content) {
  return new Set([...content.matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)].map(match => match[1]));
}

function issueFieldBlock(content, fieldId) {
  return content.replace(/\r\n/g, "\n")
    .split(/\n(?=\s+- type: )/)
    .find(block => new RegExp(`\\n\\s+id: ${escapeRegExp(fieldId)}\\n`).test(block)) ?? "";
}

function issueTemplateHasLabel(content, label) {
  const labelsBlock = content.replace(/\r\n/g, "\n").split(/\n(?=body:)/)[0] ?? "";
  return new RegExp(`\\n\\s+- ${escapeRegExp(label)}\\n`).test(`${labelsBlock}\n`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function checkNonEmptyAsset(file) {
  const path = join(root, file);
  if (!existsSync(path)) return;
  if (statSync(path).size <= 0) fail(`asset is empty: ${file}`);
}

function checkTextContains(file, text) {
  const content = readText(file);
  if (!content) return;
  if (!content.includes(text)) fail(`${file} does not mention ${text}`);
}

function checkTextDoesNotContain(file, text) {
  const content = readText(file);
  if (!content) return;
  if (content.includes(text)) fail(`${file} must not mention ${text}`);
}

function readText(file) {
  const path = join(root, file);
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8").replace(/\r\n/g, "\n");
}

function fail(message) {
  failures += 1;
  console.error(`[fail] ${message}`);
}

export { forbiddenArtifactLabel, githubTemplateIssues, issueFieldBlock, localConfigFailureLogIssues, main, npmRunReferenceIssues, npmRunScriptName, npmRunScriptNamesInText, packageIssues, packageLockIssues, releaseEvidenceIssues, workflowIssues };
