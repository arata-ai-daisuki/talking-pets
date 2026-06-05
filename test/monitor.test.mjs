import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  cuteSpeechSummary,
  detectedLanguage,
  displayPrivatePath as monitorDisplayPrivatePath,
  normalizedKey,
  parseOptions,
  processFailureMessage,
  readLatestSpeechCandidate,
  redactPrivatePaths as monitorRedactPrivatePaths,
  resolvedTTSEngine,
  routingDiagnostic,
  speechCandidate,
  textForSource,
} from "../scripts/pet-rollout-monitor.mjs";
import { providerCapability, providerLanguageSupport } from "../src/provider-capabilities.js";
import { checkAudioPath } from "../scripts/check-audio-path.mjs";
import { windowsPowerShellCommand } from "../scripts/audio-platform.mjs";
import { displayPrivatePath, fixturePaths, redactPrivatePaths } from "../scripts/check-codex-compat.mjs";
import { allowedEnvKeys, isHTTPURL, validateEnvText, validateEnvValues } from "../scripts/check-config-files.mjs";
import { installerOutputIssues, requiredInstallerIssues, requiredInstallerLabels } from "../scripts/check-installer-configs.mjs";
import { platformChecks } from "../scripts/check-platform-scripts.mjs";
import { npmCommand, packIssues, packageDocumentLinkIssues, shouldCheckExecutableMode, shouldUseShellForNPM } from "../scripts/check-npm-pack.mjs";
import { forbiddenArtifactLabel, githubTemplateIssues, issueFieldBlock, localConfigFailureLogIssues, npmRunReferenceIssues, npmRunScriptName, npmRunScriptNamesInText, packageIssues, packageLockIssues, releaseEvidenceIssues, workflowIssues } from "../scripts/check-release-readiness.mjs";
import { documentAnchors, documentLinks, shouldSkip, stripHtmlComments } from "../scripts/check-markdown-links.mjs";
import { KOKORO_VOICES, parseArgs as parseKokoroArgs } from "../scripts/tts-kokoro.mjs";
import { parseArgs as parseMeloTTSArgs, safeURLForLog as safeMeloTTSURLForLog } from "../scripts/tts-melotts.mjs";
import { parseArgs as parseVoiceboxArgs, safeURLForLog } from "../scripts/tts-voicebox.mjs";
import { formatAudioDurationSeconds, formatRealTimeFactor, latencyAudioFields, wavDurationSeconds } from "../scripts/wav-duration.mjs";
import { csvCell, formatLatencyRows, latencyRowsFromText, parseLatencyLine as parseLatencyTableLine } from "../scripts/latency-lines-to-table.mjs";
import { sanitizePublicOutput, stripURLQuery } from "../scripts/sanitize-public-output.mjs";
import { forbiddenText as sanitizerForbiddenText, requiredText as sanitizerRequiredText, sample as sanitizerSample } from "../scripts/check-public-output-sanitizer.mjs";

test("extracts event_msg agent messages from rollout JSONL", () => {
  const path = tempRollout([
    { type: "event_msg", timestamp: "2026-05-28T00:00:00Z", payload: { type: "agent_message", message: "  CI dry run ready.\n" } },
  ]);

  const result = readLatestSpeechCandidate(path, 4000);
  assert.equal(result.message, "ok");
  assert.equal(result.candidate.source, "event_msg:agent_message");
  assert.equal(result.candidate.text, "CI dry run ready.");
});

test("extracts response_item assistant messages from rollout JSONL", () => {
  const path = tempRollout([
    {
      type: "response_item",
      timestamp: "2026-05-28T00:00:00Z",
      payload: {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", output_text: "Response item ready." }],
      },
    },
  ]);

  const result = readLatestSpeechCandidate(path, 4000);
  assert.equal(result.message, "ok");
  assert.equal(result.candidate.source, "response_item:message");
  assert.equal(result.candidate.text, "Response item ready.");
});

test("reports malformed rollout files with actionable diagnostics", () => {
  const dir = mkdtempSync(join(tmpdir(), "talking-pets-test-"));
  const path = join(dir, "broken.jsonl");
  writeFileSync(path, "{not-json}\n[still broken]\n");

  const result = readLatestSpeechCandidate(path, 4000);
  assert.equal(result.candidate, null);
  assert.match(result.message, /no parseable JSON lines/);
});

test("redacts private rollout paths from monitor diagnostics by default", () => {
  const privatePath = "/Users/example/.codex/sessions/missing-rollout.jsonl";
  const result = readLatestSpeechCandidate(privatePath, 4000);
  assert.equal(result.candidate, null);
  assert.match(result.message, /ENOENT: <redacted path>/);
  assert.doesNotMatch(result.message, /Users\/example/);
  assert.equal(monitorDisplayPrivatePath(privatePath, {}), "<redacted path>");
  assert.equal(monitorDisplayPrivatePath("test/fixtures/assistant-rollout.jsonl", {}), "test/fixtures/assistant-rollout.jsonl");
  assert.equal(monitorRedactPrivatePaths(`missing ${privatePath}`, [privatePath], {}), "missing <redacted path>");

  const visible = readLatestSpeechCandidate(privatePath, 4000, { showPrivatePaths: true });
  assert.match(visible.message, /Users\/example/);
});

test("accepts explicit private path diagnostics opt-in", () => {
  assert.equal(parseOptions(["--show-private-paths"]).showPrivatePaths, true);
});

test("reports oversized speech candidates instead of speaking huge messages", () => {
  const path = tempRollout([
    { type: "event_msg", timestamp: "2026-05-28T00:00:00Z", payload: { type: "agent_message", message: "a".repeat(20) } },
  ]);

  const result = readLatestSpeechCandidate(path, 8);
  assert.equal(result.candidate, null);
  assert.match(result.message, /too long/);
});

test("normalizes source text and duplicate keys", () => {
  assert.equal(textForSource("Hello\r\n\n  world  "), "Hello world");
  assert.equal(normalizedKey("Hello, world!"), normalizedKey("hello world"));
});

test("detects priority languages and routes local TTS", () => {
  const options = parseOptions(["--tts", "auto"]);
  assert.equal(detectedLanguage("日本語の確認です"), "ja");
  assert.equal(detectedLanguage("English check ready"), "en");
  assert.equal(detectedLanguage("한국어 확인"), "ko");
  assert.equal(detectedLanguage("中文语音确认"), "zh");
  assert.equal(resolvedTTSEngine("日本語の確認です", options), "voicevox");
  assert.equal(resolvedTTSEngine("English check ready", options), "kokoro");
  assert.equal(resolvedTTSEngine("中文语音确认", options), "say");
});

test("exposes provider capabilities without overclaiming language support", () => {
  assert.equal(providerCapability("voicevox").needsExternalRuntime, true);
  assert.equal(providerLanguageSupport("voicevox", "ja").level, "provider-specific");
  assert.equal(providerCapability("kokoro").needsModelDownload, true);
  assert.equal(providerLanguageSupport("kokoro", "en").level, "provider-specific");
  assert.equal(providerCapability("voice-api").needsApiKey, true);
  assert.equal(providerCapability("sherpa-onnx-node").status, "design-only");

  assert.equal(providerLanguageSupport("say", "ko").level, "fallback-only");
  assert.equal(providerLanguageSupport("say", "zh").level, "fallback-only");
  assert.equal(providerLanguageSupport("voicevox", "ko").level, "unknown");
});

test("routing diagnostics include provider capability boundaries", () => {
  const diagnostic = routingDiagnostic("한국어 확인", "새 메시지가 있습니다.", parseOptions(["--tts", "auto", "--diagnose-routing"]));
  assert.equal(diagnostic.chosenEngine, "say");
  assert.equal(diagnostic.capability.provider, "say");
  assert.equal(diagnostic.capability.languageSupport.level, "fallback-only");
  assert.match(diagnostic.capability.languageSupport.claimBoundary, /Korean uses OS speech fallback/);
  assert.equal(diagnostic.capability.needsApiKey, false);
});

test("rejects invalid monitor CLI option values", () => {
  assert.equal(parseOptions(["--interval", "0.5"]).interval, 0.5);
  assert.equal(parseOptions(["--rate", "185"]).rate, 185);
  assert.equal(parseOptions(["--max-source-chars", "8"]).maxSourceCharacters, 8);
  assert.equal(parseOptions(["--tts", "VOICEVOX"]).ttsEngine, "voicevox");
  assert.equal(parseOptions(["--speech-language", "ZH"]).speechLanguage, "zh");

  assert.throws(() => parseOptions(["--interval", "nope"]), /positive number/);
  assert.throws(() => parseOptions(["--rate", "0"]), /positive number/);
  assert.throws(() => parseOptions(["--max-source-chars", "1.5"]), /positive integer/);
  assert.throws(() => parseOptions(["--tts", "remote"]), /must be one of/);
  assert.throws(() => parseOptions(["--voice", "--once"]), /--voice requires a value/);
  assert.throws(() => parseOptions(["--speech-language", "fr"]), /must be one of/);
});

test("summarizes mixed Japanese and English without dropping the second sentence", () => {
  const text = "マスター、Talking Pets の初回音声テストです。聞こえたら成功です。";
  const summary = cuteSpeechSummary(text, parseOptions([]));
  assert.match(summary, /Talking Pets/);
  assert.match(summary, /聞こえたら成功/);
});

test("ignores non-assistant response items", () => {
  const object = {
    type: "response_item",
    timestamp: "2026-05-28T00:00:00Z",
    payload: { type: "message", role: "user", content: [{ output_text: "Do not speak me." }] },
  };
  assert.equal(speechCandidate(object), null);
});

test("checks audio path without playing sound", () => {
  const result = checkAudioPath(process.platform);
  assert.equal(typeof result.ok, "boolean");
  assert.ok(result.lines.length >= 1);
  assert.ok(result.lines.every(line => /^\[(ok|warn)\]/.test(line)));
});

test("prefers Windows PowerShell and falls back to pwsh", () => {
  assert.equal(windowsPowerShellCommand(command => command === "powershell.exe"), "powershell.exe");
  assert.equal(windowsPowerShellCommand(command => command === "pwsh.exe"), "pwsh.exe");
  assert.equal(windowsPowerShellCommand(command => command === "pwsh"), "pwsh");
  assert.equal(windowsPowerShellCommand(() => false), null);
});

test("selects platform script checks by OS", () => {
  assert.deepEqual(platformChecks("linux").map(check => check.label), ["bash scripts"]);
  assert.deepEqual(platformChecks("linux")[0].args, ["-n", "install.sh", "check.sh", "start-selected-tts.sh"]);
  assert.deepEqual(platformChecks("linux", command => command === "pwsh", { includeAvailablePowerShell: true }).map(check => check.label), ["bash scripts", "PowerShell scripts (available)"]);
  assert.deepEqual(
    platformChecks("darwin").map(check => check.label),
    ["bash scripts", "zsh scripts", "Swift monitor parse", "Swift CLI errors"],
  );
  assert.deepEqual(platformChecks("win32").map(check => check.label), ["PowerShell scripts"]);
  assert.equal(platformChecks("win32", command => command === "powershell.exe")[0].command, "powershell.exe");
  assert.equal(platformChecks("win32", command => command === "pwsh.exe")[0].command, "pwsh.exe");
});

test("requires installer config checks on their native platforms", () => {
  assert.deepEqual(requiredInstallerLabels("darwin"), ["macOS installer"]);
  assert.deepEqual(requiredInstallerLabels("win32"), ["PowerShell installer"]);
  assert.deepEqual(requiredInstallerLabels("linux"), ["Linux installer"]);
  assert.deepEqual(requiredInstallerIssues([{ label: "macOS installer", status: "ok" }], "darwin"), []);
  assert.match(requiredInstallerIssues([{ label: "macOS installer", status: "skipped" }], "darwin").join("\n"), /macOS installer/);
  assert.match(requiredInstallerIssues([{ label: "PowerShell installer", status: "skipped" }], "win32").join("\n"), /PowerShell installer/);
  assert.match(requiredInstallerIssues([{ label: "Linux installer", status: "skipped" }], "linux").join("\n"), /Linux installer/);
});

test("keeps installer output safe for public evidence", () => {
  const workDir = "/tmp/talking-pets-install-test";
  const safeInstallerOutput = [
    "Saved config: .talking-pets.local.env",
    "MeloTTS is not installed by this installer. If you already run an external MeloTTS runtime, health-check it with:",
    "  npm run monitor:node -- --tts melotts --list-voices --melotts-url http://127.0.0.1:3399/health",
    "Start: ./start",
  ].join("\n");
  assert.deepEqual(installerOutputIssues(safeInstallerOutput, workDir, "installer"), []);
  assert.match(
    installerOutputIssues("Saved config: .talking-pets.local.env\nStart: ./start\n", workDir, "installer").join("\n"),
    /external runtime detect-only wording/,
  );
  assert.match(
    installerOutputIssues(`Saved config: ${workDir}/.talking-pets.local.env\n`, workDir, "installer").join("\n"),
    /working directory path/,
  );
  assert.match(
    installerOutputIssues("Saved config: /Users/example/talking-pets/.talking-pets.local.env\n", workDir, "installer").join("\n"),
    /absolute saved config path/,
  );
});

test("formats TTS process failures without leaking spoken text", () => {
  assert.equal(
    processFailureMessage("/usr/bin/say", { status: 1 }, "macOS say"),
    "[tts-error] macOS say failed: exit 1 (/usr/bin/say)",
  );
  assert.equal(
    processFailureMessage("espeak", { error: { code: "ENOENT" } }, "Linux espeak"),
    "[tts-error] Linux espeak failed: ENOENT (espeak)",
  );
});

test("redacts spoken text from voicebox error URLs", () => {
  assert.equal(
    safeURLForLog("http://127.0.0.1:50021/audio_query?text=private%20message&speaker=3#token"),
    "http://127.0.0.1:50021/audio_query",
  );
  assert.equal(
    safeURLForLog("not-a-url?text=private#token"),
    "not-a-url?[redacted]",
  );
});

test("reads WAV duration and formats latency audio fields", () => {
  const wav = samplePCM16Wav({ sampleRate: 24000, channels: 1, durationSeconds: 1.5 });
  assert.equal(wavDurationSeconds(wav), 1.5);
  assert.equal(formatAudioDurationSeconds(1.5), "1.5s");
  assert.equal(formatRealTimeFactor(0.5), "0.50x");
  assert.deepEqual(
    latencyAudioFields({ audioDurationSeconds: 1.5, steps: [{ name: "synthesis", ms: 750 }] }),
    { audioDuration: "1.5s", rtf: "0.50x" },
  );
  assert.equal(wavDurationSeconds(Buffer.from("not wav")), null);
});

test("converts latency lines to markdown and CSV tables", () => {
  const input = [
    "[latency] total=1334.3ms audio_query=120.0ms synthesis=1100.0ms audioDuration=3.861333s rtf=0.28x provider=voicevox success=true play=false",
    "ignored line",
    "[latency] total=9565.2ms synthesis=9560.9ms audioDuration=3.92s rtf=2.44x provider=irodori success=true play=false",
  ].join("\n");
  const rows = latencyRowsFromText(input);
  assert.deepEqual(rows[0], {
    run: 1,
    total: "1334.3ms",
    audio_query: "120.0ms",
    synthesis: "1100.0ms",
    audioDuration: "3.861333s",
    rtf: "0.28x",
    provider: "voicevox",
    success: "true",
    play: "false",
  });
  assert.match(formatLatencyRows(rows, "markdown"), /\| 1 \| voicevox \| 1334\.3ms \| 1100\.0ms \| 3\.861333s \| 0\.28x \| false \| true \| 120\.0ms \|/);
  assert.match(formatLatencyRows(rows, "csv"), /^run,provider,total,synthesis,audioDuration,rtf,play,success,audio_query/m);
  assert.equal(parseLatencyTableLine("[latency] provider=a|b total=1ms").provider, "a|b");
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
});

test("sanitizes public check output before issue sharing", () => {
  assert.equal(
    stripURLQuery("http://127.0.0.1:50021/audio_query?text=secret&speaker=3"),
    "http://127.0.0.1:50021/audio_query",
  );
  const sanitized = sanitizePublicOutput([
    'TALKING_PETS_VOICEVOX_URL="https://private.example.local/api?token=secret"',
    "TALKING_PETS_VOICEBOX_URL=https://private-unquoted.example.local/api?token=secret",
    'OPENAI_API_KEY="sk-private"',
    "ACCESS_TOKEN=secret-token",
    "Authorization: Bearer secret-header",
    "X-Api-Key: private-header",
    "LOCAL_PASSWORD='private-password'",
    "SPACE_PASSWORD=private password with spaces",
    "VOICEVOX: not reachable (https://private.example.local/api?token=secret)",
    "TALKING_PETS_SAY_VOICE=Private Voice Name",
    "[rollout] test/fixtures/assistant-rollout.jsonl",
    "[rollout] test/fixtures/mixed-ja-en-rollout.jsonl",
    "[rollout] test/fixtures/ko-zh-rollout.jsonl",
    "[rollout] /Users/example/.codex/sessions/private-rollout.jsonl",
    "[rollout] test/fixtures/private-rollout.jsonl",
    "[source] private Codex conversation",
    "[pet] private spoken summary",
    "db: C:\\Users\\example\\.codex\\state_5.sqlite",
    "cache db: metadata.sqlite3",
    "local db: speech-cache.db",
    "cwd: /Users/example/projects/talking-pets",
    "audio: /home/example/talking-pets/out/private.wav",
    "home rollout: $HOME/.codex/sessions/private-rollout.jsonl",
    "profile db: %USERPROFILE%\\.codex\\state_5.sqlite",
    "tilde audio: ~/talking-pets/out/private.mp3",
    "recording: ~/talking-pets/out/private-demo.mp4",
    "mov recording: private-demo.mov",
    "archive: /Users/example/Desktop/talking-pets-release.zip",
    "metadata: /Users/example/Desktop/.DS_Store",
    "bare metadata: .DS_Store",
    "Saved config: /Users/example/talking-pets/.talking-pets.local.env",
    "Saved config: C:\\Users\\example\\talking-pets\\.talking-pets.local.env",
    "config source: local file (/home/example/talking-pets/.talking-pets.local.env)",
    'space db: "C:\\Users\\Jane Doe\\.codex\\state_5.sqlite"',
    "space cwd: '/Users/Jane Doe/projects/talking-pets'",
    "space recording: `/Users/Jane Doe/Desktop/private demo.mov`",
    "space rollout: '/Users/Jane Doe/.codex/sessions/private rollout.jsonl'",
    "TALKING_PETS_SAY_VOICE=PrivateVoice",
  ].join("\n"));

  assert.match(sanitized, /TALKING_PETS_VOICEVOX_URL="<redacted>"/);
  assert.match(sanitized, /TALKING_PETS_VOICEBOX_URL=<redacted>/);
  assert.match(sanitized, /OPENAI_API_KEY=<redacted credential>/);
  assert.match(sanitized, /ACCESS_TOKEN=<redacted credential>/);
  assert.match(sanitized, /Authorization: <redacted credential>/);
  assert.match(sanitized, /X-Api-Key: <redacted credential>/);
  assert.match(sanitized, /LOCAL_PASSWORD=<redacted credential>/);
  assert.match(sanitized, /SPACE_PASSWORD=<redacted credential>/);
  assert.match(sanitized, /TALKING_PETS_SAY_VOICE=<redacted>/);
  assert.match(sanitized, /<redacted endpoint>/);
  assert.match(sanitized, /\[rollout\] test\/fixtures\/assistant-rollout\.jsonl/);
  assert.match(sanitized, /\[rollout\] test\/fixtures\/mixed-ja-en-rollout\.jsonl/);
  assert.match(sanitized, /\[rollout\] test\/fixtures\/ko-zh-rollout\.jsonl/);
  assert.match(sanitized, /<redacted rollout JSONL>/);
  assert.match(sanitized, /\[source\] <redacted conversation text>/);
  assert.match(sanitized, /\[pet\] <redacted spoken text>/);
  assert.match(sanitized, /<redacted path>/);
  assert.match(sanitized, /<redacted state DB>/);
  assert.doesNotMatch(sanitized, /private\.example/);
  assert.doesNotMatch(sanitized, /private-unquoted\.example/);
  assert.doesNotMatch(sanitized, /sk-private|secret-token|secret-header|private-header|private-password/);
  assert.doesNotMatch(sanitized, /private password with spaces|Private Voice Name/);
  assert.doesNotMatch(sanitized, /private Codex conversation/);
  assert.doesNotMatch(sanitized, /private-rollout\.jsonl/);
  assert.doesNotMatch(sanitized, /Users\\example|Users\/example|home\/example/);
  assert.doesNotMatch(sanitized, /Jane Doe|private demo\.mov|private rollout\.jsonl/);
  assert.doesNotMatch(sanitized, /\$HOME|%USERPROFILE%|~\/talking-pets/);
  assert.doesNotMatch(sanitized, /private-demo\.(?:mp4|mov)|talking-pets-release\.zip|metadata\.sqlite3|speech-cache\.db|\.DS_Store/);
  assert.doesNotMatch(sanitized, /PrivateVoice/);
});

test("keeps sanitizer smoke sample covering space-containing private paths", () => {
  assert.match(sanitizerSample, /Jane Doe/);
  assert.match(sanitizerSample, /private demo\.mov/);
  assert.match(sanitizerSample, /private rollout\.jsonl/);
  assert.match(sanitizerSample, /X-Api-Key: private-header/);
  assert.match(sanitizerSample, /Private Voice Name/);
  assert.match(sanitizerRequiredText.join("\n"), /X-Api-Key: <redacted credential>/);
  assert.match(sanitizerRequiredText.join("\n"), /TALKING_PETS_SAY_VOICE=<redacted>/);
  assert.match(sanitizerForbiddenText.join("\n"), /Jane Doe/);
  assert.match(sanitizerForbiddenText.join("\n"), /private demo\.mov/);
  assert.match(sanitizerForbiddenText.join("\n"), /private rollout\.jsonl/);
  assert.match(sanitizerForbiddenText.join("\n"), /Private Voice Name/);
});

test("validates Voicebox CLI options without sending text", () => {
  assert.equal(parseVoiceboxArgs(["--list-voices"])["list-voices"], true);
  assert.equal(parseVoiceboxArgs(["--mode", "generic", "--profile-id", "pet"])["profile-id"], "pet");
  assert.equal(parseVoiceboxArgs(["--play", "--text", "hello"]).play, true);

  assert.throws(() => parseVoiceboxArgs(["--url"]), /requires a value/);
  assert.throws(() => parseVoiceboxArgs(["--url", "--play"]), /--url requires a value/);
  assert.throws(() => parseVoiceboxArgs(["--remote", "yes"]), /Unknown option/);
  assert.throws(() => parseVoiceboxArgs(["hello"]), /Unexpected positional argument/);
});

test("validates Kokoro CLI options without loading the model", () => {
  assert.equal(KOKORO_VOICES.af_heart.language, "en-us");
  assert.equal(parseKokoroArgs(["--list-voices"])["list-voices"], true);
  assert.equal(parseKokoroArgs(["--voice", "af_bella", "--text", "hello"]).voice, "af_bella");

  assert.throws(() => parseKokoroArgs(["--voice"]), /requires a value/);
  assert.throws(() => parseKokoroArgs(["--voice", "--play"]), /--voice requires a value/);
  assert.throws(() => parseKokoroArgs(["--remote"]), /Unknown option/);
  assert.throws(() => parseKokoroArgs(["hello"]), /Unexpected positional argument/);
});

test("identifies release-forbidden local artifacts", () => {
  assert.equal(forbiddenArtifactLabel(".talking-pets.local.env"), "local config");
  assert.equal(forbiddenArtifactLabel(".env.local"), "local env file");
  assert.equal(forbiddenArtifactLabel(".talking-pets.local.env.example"), null);
  assert.equal(forbiddenArtifactLabel("presets/examples/privacy-first-say.env"), null);
  assert.equal(forbiddenArtifactLabel("presets/examples/generic-voicebox.env"), null);
  assert.equal(forbiddenArtifactLabel(".DS_Store"), "macOS metadata");
  assert.equal(forbiddenArtifactLabel("state_5.sqlite"), "Codex state DB");
  assert.equal(forbiddenArtifactLabel("cache/metadata.sqlite3"), "SQLite DB");
  assert.equal(forbiddenArtifactLabel("sessions/rollout.jsonl"), "private rollout JSONL");
  assert.equal(forbiddenArtifactLabel("test/fixtures/assistant-rollout.jsonl"), null);
  assert.equal(forbiddenArtifactLabel("test/fixtures/private-rollout.jsonl"), "private rollout JSONL");
  assert.equal(forbiddenArtifactLabel("test/fixtures/private.sqlite"), "SQLite DB");
  assert.equal(forbiddenArtifactLabel("speech.wav"), "generated audio");
  assert.equal(forbiddenArtifactLabel("speech.mp3"), "generated audio");
  assert.equal(forbiddenArtifactLabel("speech.opus"), "generated audio");
  assert.equal(forbiddenArtifactLabel("docs/demo/talking-pets-overlay-2026-05-28.mov"), null);
  assert.equal(forbiddenArtifactLabel("docs/demo/private-recording.mp4"), "local recording");
  assert.equal(forbiddenArtifactLabel("docs/demo/private-recording.mov"), "local recording");
  assert.equal(forbiddenArtifactLabel("talking-pets-release.zip"), "local archive");
  assert.equal(forbiddenArtifactLabel("models/voice.onnx"), "model file");
  assert.equal(forbiddenArtifactLabel("local-experimental/bridge.html"), "local experimental folder");
});

test("keeps multilingual rollout fixtures in default compatibility checks", () => {
  assert.deepEqual(fixturePaths({ fixtures: [] }), [
    "test/fixtures/assistant-rollout.jsonl",
    "test/fixtures/mixed-ja-en-rollout.jsonl",
    "test/fixtures/ko-zh-rollout.jsonl",
  ]);
});

test("redacts private paths from stateful compat diagnostics by default", () => {
  const stateDB = "/Users/example/.codex/state_5.sqlite";
  const rollout = "/Users/example/.codex/sessions/private-rollout.jsonl";
  const message = `rollout unreadable (ENOENT: ${rollout}); db ${stateDB}`;

  assert.equal(displayPrivatePath(stateDB, { showPrivatePaths: false }), "<redacted path>");
  assert.equal(displayPrivatePath(stateDB, { showPrivatePaths: true }), stateDB);
  assert.equal(
    redactPrivatePaths(message, [stateDB, rollout], { showPrivatePaths: false }),
    "rollout unreadable (ENOENT: <redacted path>); db <redacted path>",
  );
  assert.equal(redactPrivatePaths(message, [stateDB, rollout], { showPrivatePaths: true }), message);
});

test("reports compat CLI argument errors without a stack trace", () => {
  const result = spawnSync(process.execPath, ["--no-warnings", "scripts/check-codex-compat.mjs", "--unknown"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /compat: Unknown option: --unknown/);
  assert.doesNotMatch(result.stderr, /at parseArgs/);

  const missingValue = spawnSync(process.execPath, ["--no-warnings", "scripts/check-codex-compat.mjs", "--fixture", "--no-state"], {
    encoding: "utf8",
  });
  assert.equal(missingValue.status, 2);
  assert.match(missingValue.stderr, /compat: --fixture requires a value/);
  assert.doesNotMatch(missingValue.stderr, /at parseArgs/);
});

test("reports audio check CLI argument errors without a stack trace", () => {
  const result = spawnSync(process.execPath, ["--no-warnings", "scripts/check-audio-path.mjs", "--loud"], {
    encoding: "utf8",
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /audio path: Unknown option: --loud/);
  assert.doesNotMatch(result.stderr, /at parseArgs/);
});

test("MeloTTS helper is health-only and redacts URL details", () => {
  assert.deepEqual(parseMeloTTSArgs(["--health", "--url", "http://127.0.0.1:3399/health"]), {
    health: true,
    url: "http://127.0.0.1:3399/health",
  });
  assert.throws(() => parseMeloTTSArgs(["--text", "hello"]), /Unknown option: --text/);
  assert.equal(safeMeloTTSURLForLog("http://127.0.0.1:3399/health?text=secret#frag"), "http://127.0.0.1:3399/health");
});

test("MeloTTS helper reports missing config cleanly", () => {
  const result = spawnSync(process.execPath, ["--no-warnings", "scripts/tts-melotts.mjs", "--health"], {
    encoding: "utf8",
    env: {
      ...process.env,
      MELOTTS_URL: "",
      MELOTTS_COMMAND: "",
    },
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /tts-melotts: not_configured/);
  assert.doesNotMatch(result.stderr, /at parseArgs/);
});

test("monitor exposes MeloTTS health-only list path", () => {
  const options = parseOptions([
    "--tts", "melotts",
    "--list-voices",
    "--melotts-url", "http://127.0.0.1:3399/health",
    "--melotts-health-arg", "status",
    "--melotts-timeout-ms", "25",
  ]);

  assert.equal(options.ttsEngine, "melotts");
  assert.equal(options.listVoices, true);
  assert.equal(options.melottsURL, "http://127.0.0.1:3399/health");
  assert.equal(options.melottsHealthArg, "status");
  assert.equal(options.melottsTimeoutMs, 25);

  const missing = spawnSync(process.execPath, ["--no-warnings", "scripts/pet-rollout-monitor.mjs", "--tts", "melotts", "--list-voices"], {
    encoding: "utf8",
    env: {
      ...process.env,
      MELOTTS_URL: "",
      MELOTTS_COMMAND: "",
    },
  });
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /tts-melotts: not_configured/);
  assert.doesNotMatch(missing.stderr, /at parseArgs/);

  const configured = spawnSync(process.execPath, ["--no-warnings", "scripts/pet-rollout-monitor.mjs", "--tts", "melotts", "--list-voices", "--melotts-command", process.execPath], {
    encoding: "utf8",
    env: {
      ...process.env,
      MELOTTS_URL: "",
      MELOTTS_COMMAND: "",
    },
  });
  assert.equal(configured.status, 0);
  assert.doesNotMatch(configured.stderr, /not_configured/);
});

test("detects release readiness package and workflow drift", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.deepEqual(packageIssues(pkg), []);

  const packageWithoutSwiftCheck = structuredClone(pkg);
  delete packageWithoutSwiftCheck.scripts["check:swift-cli"];
  packageWithoutSwiftCheck.scripts["check:all"] =
    packageWithoutSwiftCheck.scripts["check:all"].replace(" && npm run check:swift-cli", "");
  packageWithoutSwiftCheck.scripts["check:syntax"] =
    packageWithoutSwiftCheck.scripts["check:syntax"].replace(" && node --check scripts/check-swift-cli.mjs", "");
  assert.match(packageIssues(packageWithoutSwiftCheck).join("\n"), /check:swift-cli/);

  const packageWithoutPlatformScripts = structuredClone(pkg);
  delete packageWithoutPlatformScripts.scripts["check:platform-scripts"];
  packageWithoutPlatformScripts.scripts["check:all"] =
    packageWithoutPlatformScripts.scripts["check:all"].replace(" && npm run check:platform-scripts", "");
  packageWithoutPlatformScripts.scripts["check:syntax"] =
    packageWithoutPlatformScripts.scripts["check:syntax"].replace(" && node --check scripts/check-platform-scripts.mjs", "");
  assert.match(packageIssues(packageWithoutPlatformScripts).join("\n"), /check:platform-scripts/);

  const packageWithoutInstallerCheck = structuredClone(pkg);
  delete packageWithoutInstallerCheck.scripts["check:installers"];
  packageWithoutInstallerCheck.scripts["check:all"] =
    packageWithoutInstallerCheck.scripts["check:all"].replace(" && npm run check:installers", "");
  packageWithoutInstallerCheck.scripts["check:syntax"] =
    packageWithoutInstallerCheck.scripts["check:syntax"].replace(" && node --check scripts/check-installer-configs.mjs", "");
  assert.match(packageIssues(packageWithoutInstallerCheck).join("\n"), /check:installers/);

  const packageWithStatefulCheckAll = structuredClone(pkg);
  packageWithStatefulCheckAll.scripts["check:all"] =
    packageWithStatefulCheckAll.scripts["check:all"].replace("npm run check:compat -- --no-state", "npm run check:compat");
  assert.match(packageIssues(packageWithStatefulCheckAll).join("\n"), /check:compat -- --no-state/);

  const packageWithoutSanitizerCheck = structuredClone(pkg);
  delete packageWithoutSanitizerCheck.scripts["check:sanitize"];
  packageWithoutSanitizerCheck.scripts["check:all"] =
    packageWithoutSanitizerCheck.scripts["check:all"].replace(" && npm run check:sanitize", "");
  packageWithoutSanitizerCheck.scripts["check:syntax"] =
    packageWithoutSanitizerCheck.scripts["check:syntax"].replace(" && node --check scripts/check-public-output-sanitizer.mjs", "");
  assert.match(packageIssues(packageWithoutSanitizerCheck).join("\n"), /check:sanitize/);

  const packageWithoutFilesAllowlist = structuredClone(pkg);
  delete packageWithoutFilesAllowlist.files;
  assert.match(packageIssues(packageWithoutFilesAllowlist).join("\n"), /files allowlist/);

  const packageWithoutJapaneseReadme = structuredClone(pkg);
  packageWithoutJapaneseReadme.files = packageWithoutJapaneseReadme.files.filter(file => file !== "README.md");
  assert.match(packageIssues(packageWithoutJapaneseReadme).join("\n"), /files must include README\.md/);

  const packageWithoutVerificationStatus = structuredClone(pkg);
  packageWithoutVerificationStatus.files = packageWithoutVerificationStatus.files.filter(file => file !== "docs/verification-status.md");
  assert.match(packageIssues(packageWithoutVerificationStatus).join("\n"), /files must include docs\/verification-status\.md/);

  const packageWithWrongPackageManager = structuredClone(pkg);
  packageWithWrongPackageManager.packageManager = "npm@10.0.0";
  assert.match(packageIssues(packageWithWrongPackageManager).join("\n"), /packageManager/);

  const packageWithForbiddenFile = structuredClone(pkg);
  packageWithForbiddenFile.files.push("implementation-notes.md");
  assert.match(packageIssues(packageWithForbiddenFile).join("\n"), /must not include implementation-notes/);

  const workflow = readFileSync(".github/workflows/ci.yml", "utf8");
  assert.deepEqual(workflowIssues(workflow), []);
  assert.match(workflowIssues(workflow.replace("npm install -g npm@11.6.4", "npm install -g npm@10.0.0")).join("\n"), /npm@11\.6\.4/);
  assert.match(workflowIssues(workflow.replace("npm run check:swift-cli", "")).join("\n"), /check:swift-cli/);
  assert.match(workflowIssues(workflow.replace("npm run check:platform-scripts", "")).join("\n"), /check:platform-scripts/);
  assert.match(workflowIssues(workflow.replace("npm run check:installers", "")).join("\n"), /check:installers/);
  assert.match(workflowIssues(workflow.replace("npm run check:pack", "")).join("\n"), /check:pack/);
  assert.match(workflowIssues(workflow.replace("npm run check:all", "")).join("\n"), /check:all/);
  assert.match(workflowIssues(workflow.replace("npm run check:sanitize", "")).join("\n"), /check:sanitize/);
  assert.match(workflowIssues(workflow.replace("npm run test:dry-run", "")).join("\n"), /test:dry-run/);
});

test("detects issue template privacy guidance drift", () => {
  const templateFiles = [
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/install_trouble.yml",
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
  ];
  const templates = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  const pr = readFileSync(".github/pull_request_template.md", "utf8");
  assert.deepEqual(githubTemplateIssues(templates, pr), []);

  const bugTemplate = templates.get(".github/ISSUE_TEMPLATE/bug_report.yml");
  assert.match(issueFieldBlock(bugTemplate, "arch"), /CPU architecture/);
  assert.match(issueFieldBlock(bugTemplate, "node"), /Node\.js and npm versions/);
  assert.match(issueFieldBlock(bugTemplate, "codex_version"), /required: false/);
  assert.match(issueFieldBlock(bugTemplate, "codex_version"), /Codex Desktop \/ CLI version if known/);
  assert.match(issueFieldBlock(bugTemplate, "speech_language"), /required: false/);
  assert.match(issueFieldBlock(bugTemplate, "speech_language"), /TALKING_PETS_SPEECH_LANGUAGE/);
  assert.match(issueFieldBlock(bugTemplate, "config_source"), /required: false/);
  assert.match(issueFieldBlock(bugTemplate, "config_source"), /installer default/);
  templates.set(".github/ISSUE_TEMPLATE/bug_report.yml", bugTemplate.replace("local env values, ", ""));
  assert.match(githubTemplateIssues(templates, pr).join("\n"), /local env values/);
  const templatesWithoutBugSpeechLanguage = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutBugSpeechLanguage.set(
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    templatesWithoutBugSpeechLanguage.get(".github/ISSUE_TEMPLATE/bug_report.yml").replace("id: speech_language", "id: speech_hint"),
  );
  assert.match(githubTemplateIssues(templatesWithoutBugSpeechLanguage, pr).join("\n"), /bug_report\.yml missing issue form field id: speech_language/);
  const templatesWithoutBugConfigSource = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutBugConfigSource.set(
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    templatesWithoutBugConfigSource.get(".github/ISSUE_TEMPLATE/bug_report.yml").replace("id: config_source", "id: config"),
  );
  assert.match(githubTemplateIssues(templatesWithoutBugConfigSource, pr).join("\n"), /bug_report\.yml missing issue form field id: config_source/);

  const installTemplate = templates.get(".github/ISSUE_TEMPLATE/install_trouble.yml");
  assert.match(issueFieldBlock(installTemplate, "arch"), /CPU architecture/);
  assert.match(issueFieldBlock(installTemplate, "node"), /Node\.js and npm versions/);
  assert.match(issueFieldBlock(installTemplate, "codex_version"), /required: false/);
  assert.match(issueFieldBlock(installTemplate, "codex_version"), /Codex Desktop \/ CLI version if known/);
  assert.match(issueFieldBlock(installTemplate, "speech_language"), /required: false/);
  assert.match(issueFieldBlock(installTemplate, "speech_language"), /TALKING_PETS_SPEECH_LANGUAGE/);
  assert.match(issueFieldBlock(installTemplate, "config_source"), /required: false/);
  assert.match(issueFieldBlock(installTemplate, "config_source"), /installer default/);
  const templatesWithoutInstallSpeechLanguage = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutInstallSpeechLanguage.set(
    ".github/ISSUE_TEMPLATE/install_trouble.yml",
    templatesWithoutInstallSpeechLanguage.get(".github/ISSUE_TEMPLATE/install_trouble.yml").replace("id: speech_language", "id: speech_hint"),
  );
  assert.match(githubTemplateIssues(templatesWithoutInstallSpeechLanguage, pr).join("\n"), /install_trouble\.yml missing issue form field id: speech_language/);
  const templatesWithoutInstallConfigSource = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutInstallConfigSource.set(
    ".github/ISSUE_TEMPLATE/install_trouble.yml",
    templatesWithoutInstallConfigSource.get(".github/ISSUE_TEMPLATE/install_trouble.yml").replace("id: config_source", "id: config"),
  );
  assert.match(githubTemplateIssues(templatesWithoutInstallConfigSource, pr).join("\n"), /install_trouble\.yml missing issue form field id: config_source/);

  const templatesWithoutInstallConversationText = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutInstallConversationText.set(
    ".github/ISSUE_TEMPLATE/install_trouble.yml",
    templatesWithoutInstallConversationText.get(".github/ISSUE_TEMPLATE/install_trouble.yml").replaceAll("conversation text, ", ""),
  );
  assert.match(githubTemplateIssues(templatesWithoutInstallConversationText, pr).join("\n"), /conversation text/);

  const templatesWithoutVerificationLabel = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutVerificationLabel.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    templatesWithoutVerificationLabel.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace("  - verification", "  - evidence"),
  );
  assert.match(githubTemplateIssues(templatesWithoutVerificationLabel, pr).join("\n"), /issue label: verification/);

  const templatesWithoutSpeechLanguage = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutSpeechLanguage.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    templatesWithoutSpeechLanguage.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace("id: speech_language", "id: speech_hint"),
  );
  assert.match(githubTemplateIssues(templatesWithoutSpeechLanguage, pr).join("\n"), /speech_language/);

  const templatesWithoutConfigSource = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutConfigSource.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    templatesWithoutConfigSource.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace("id: config_source", "id: config"),
  );
  assert.match(githubTemplateIssues(templatesWithoutConfigSource, pr).join("\n"), /config_source/);

  const templatesWithoutPlatformCheckDescription = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutPlatformCheckDescription.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    templatesWithoutPlatformCheckDescription.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace(
      "Share real-device install, platform check, dry-run, and audible TTS evidence",
      "Share real-device install, dry-run, and audible TTS evidence",
    ),
  );
  assert.match(githubTemplateIssues(templatesWithoutPlatformCheckDescription, pr).join("\n"), /platform check/);

  const templatesWithoutBugCommands = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutBugCommands.set(
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    templatesWithoutBugCommands.get(".github/ISSUE_TEMPLATE/bug_report.yml").replace("id: commands", "id: output"),
  );
  assert.match(githubTemplateIssues(templatesWithoutBugCommands, pr).join("\n"), /commands/);

  const templatesWithoutTerms = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutTerms.set(
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
    templatesWithoutTerms.get(".github/ISSUE_TEMPLATE/tts_provider_request.yml").replace("id: terms", "id: license"),
  );
  assert.match(githubTemplateIssues(templatesWithoutTerms, pr).join("\n"), /terms/);

  const templatesWithoutTTSLanguages = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutTTSLanguages.set(
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
    templatesWithoutTTSLanguages.get(".github/ISSUE_TEMPLATE/tts_provider_request.yml").replace("id: languages", "id: voices"),
  );
  assert.match(githubTemplateIssues(templatesWithoutTTSLanguages, pr).join("\n"), /languages/);

  const templatesWithoutTTSRequirements = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutTTSRequirements.set(
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
    templatesWithoutTTSRequirements.get(".github/ISSUE_TEMPLATE/tts_provider_request.yml").replace("id: requirements", "id: setup"),
  );
  assert.match(githubTemplateIssues(templatesWithoutTTSRequirements, pr).join("\n"), /requirements/);

  const templatesWithoutTTSPrivacy = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutTTSPrivacy.set(
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
    templatesWithoutTTSPrivacy.get(".github/ISSUE_TEMPLATE/tts_provider_request.yml").replace("id: privacy", "id: data_flow"),
  );
  assert.match(githubTemplateIssues(templatesWithoutTTSPrivacy, pr).join("\n"), /privacy/);

  const templatesWithoutTTSSanitizer = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutTTSSanitizer.set(
    ".github/ISSUE_TEMPLATE/tts_provider_request.yml",
    templatesWithoutTTSSanitizer.get(".github/ISSUE_TEMPLATE/tts_provider_request.yml").replaceAll("npm run sanitize:public-output", "npm run clean-output"),
  );
  assert.match(githubTemplateIssues(templatesWithoutTTSSanitizer, pr).join("\n"), /sanitize:public-output/);

  const platformTemplate = templates.get(".github/ISSUE_TEMPLATE/platform_verification.yml");
  assert.match(issueFieldBlock(platformTemplate, "audible"), /required: true/);
  assert.match(issueFieldBlock(platformTemplate, "codex_version"), /required: false/);
  assert.match(issueFieldBlock(platformTemplate, "tts"), /- macOS say/);
  assert.match(issueFieldBlock(platformTemplate, "tts"), /- Windows OS speech/);
  assert.match(issueFieldBlock(platformTemplate, "tts"), /- Linux espeak/);
  assert.match(issueFieldBlock(platformTemplate, "notes"), /required: false/);

  assert.match(pr, /npm run check:compat/);
  assert.match(
    githubTemplateIssues(templates, pr.replace("- [ ] `npm run test:dry-run`", "- [ ] `npm run test:fixture`")).join("\n"),
    /test:dry-run/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("`audible: yes`", "`audible: confirmed`")).join("\n"),
    /audible: yes/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("`sanitized: yes`", "`sanitized: confirmed`")).join("\n"),
    /sanitized: yes/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("install, platform check, dry-run, and one audible TTS command output", "install and sound check")).join("\n"),
    /install, platform check, dry-run/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("Linked from a sanitized Platform verification issue for release notes", "Linked from a platform report")).join("\n"),
    /sanitized Platform verification issue/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("- [ ] `npm run check:compat`", "- [ ] `npm run check:fixture`")).join("\n"),
    /check:compat/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("macOS metadata, ", "")).join("\n"),
    /macOS metadata/,
  );
  assert.match(
    githubTemplateIssues(templates, pr.replace("downloaded model files, ", "")).join("\n"),
    /downloaded model files/,
  );

  const templatesWithoutRequiredAudible = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutRequiredAudible.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    templatesWithoutRequiredAudible.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace(
      /id: audible([\s\S]*?)required: true/,
      "id: audible$1required: false",
    ),
  );
  assert.match(githubTemplateIssues(templatesWithoutRequiredAudible, pr).join("\n"), /audible/);

  const templatesWithoutLinuxEspeakOption = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutLinuxEspeakOption.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    removeLine(templatesWithoutLinuxEspeakOption.get(".github/ISSUE_TEMPLATE/platform_verification.yml"), "        - Linux espeak"),
  );
  assert.match(githubTemplateIssues(templatesWithoutLinuxEspeakOption, pr).join("\n"), /tts option: Linux espeak/);

  const templatesWithoutPlatformOtherTTSOption = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutPlatformOtherTTSOption.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    removeLine(templatesWithoutPlatformOtherTTSOption.get(".github/ISSUE_TEMPLATE/platform_verification.yml"), "        - Other local TTS"),
  );
  assert.match(githubTemplateIssues(templatesWithoutPlatformOtherTTSOption, pr).join("\n"), /platform_verification\.yml missing tts option: Other local TTS/);

  const templatesWithoutBugOtherTTSOption = new Map(templateFiles.map(file => [file, readFileSync(file, "utf8")]));
  templatesWithoutBugOtherTTSOption.set(
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    removeLine(templatesWithoutBugOtherTTSOption.get(".github/ISSUE_TEMPLATE/bug_report.yml"), "        - Other local TTS"),
  );
  assert.match(githubTemplateIssues(templatesWithoutBugOtherTTSOption, pr).join("\n"), /bug_report\.yml missing tts option: Other local TTS/);
});

test("detects release evidence command drift", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const docs = new Map([
    ["docs/release-notes-template.md", readFileSync("docs/release-notes-template.md", "utf8")],
    ["docs/real-device-verification.md", readFileSync("docs/real-device-verification.md", "utf8")],
    ["docs/verification-status.md", readFileSync("docs/verification-status.md", "utf8")],
    [".github/ISSUE_TEMPLATE/platform_verification.yml", readFileSync(".github/ISSUE_TEMPLATE/platform_verification.yml", "utf8")],
  ]);
  assert.equal(npmRunScriptName("npm ci"), null);
  assert.equal(npmRunScriptName("npm run check:audio:strict"), "check:audio:strict");
  assert.equal(npmRunScriptName("npm run check:compat -- --no-state"), "check:compat");
  assert.deepEqual(
    npmRunScriptNamesInText("`npm run monitor:node -- --once` and `npm run sanitize:public-output`"),
    new Set(["monitor:node", "sanitize:public-output"]),
  );
  assert.deepEqual(releaseEvidenceIssues(docs, pkg.scripts), []);

  const withoutStrictAudio = new Map(docs);
  withoutStrictAudio.set(
    "docs/release-notes-template.md",
    withoutStrictAudio.get("docs/release-notes-template.md").replaceAll("npm run check:audio:strict", "npm run check:audio"),
  );
  assert.match(releaseEvidenceIssues(withoutStrictAudio).join("\n"), /check:audio:strict/);

  const withoutReleaseSanitizedMarker = new Map(docs);
  withoutReleaseSanitizedMarker.set(
    "docs/release-notes-template.md",
    withoutReleaseSanitizedMarker.get("docs/release-notes-template.md").replaceAll(" / sanitized: yes|no", ""),
  );
  assert.match(releaseEvidenceIssues(withoutReleaseSanitizedMarker).join("\n"), /sanitized: yes\|no/);

  const withoutReleaseConfigSourceMarker = new Map(docs);
  withoutReleaseConfigSourceMarker.set(
    "docs/release-notes-template.md",
    withoutReleaseConfigSourceMarker.get("docs/release-notes-template.md").replaceAll(" / config source: <installer default|preset|custom|none>", ""),
  );
  assert.match(releaseEvidenceIssues(withoutReleaseConfigSourceMarker).join("\n"), /config source/);

  const withoutReleaseNoStateLimit = new Map(docs);
  withoutReleaseNoStateLimit.set(
    "docs/release-notes-template.md",
    withoutReleaseNoStateLimit.get("docs/release-notes-template.md").replaceAll("no local Codex state", "fixture-only verification"),
  );
  assert.match(releaseEvidenceIssues(withoutReleaseNoStateLimit).join("\n"), /no local Codex state/);

  const withoutReleaseKnownLimitFields = new Map(docs);
  withoutReleaseKnownLimitFields.set(
    "docs/release-notes-template.md",
    withoutReleaseKnownLimitFields.get("docs/release-notes-template.md").replace(
      "OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known",
      "install, dry-run, one audible TTS path",
    ),
  );
  assert.match(releaseEvidenceIssues(withoutReleaseKnownLimitFields).join("\n"), /full Windows \/ Linux graduation evidence fields/);

  const withoutRealDeviceKnownLimitFields = new Map(docs);
  withoutRealDeviceKnownLimitFields.set(
    "docs/real-device-verification.md",
    withoutRealDeviceKnownLimitFields.get("docs/real-device-verification.md").replace(
      "OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known",
      "install, dry-run, one audible TTS path",
    ),
  );
  assert.match(releaseEvidenceIssues(withoutRealDeviceKnownLimitFields).join("\n"), /full Windows \/ Linux graduation evidence fields/);

  const withoutRuntime = new Map(docs);
  withoutRuntime.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    withoutRuntime.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace("`npm run check:runtime`, ", ""),
  );
  assert.match(releaseEvidenceIssues(withoutRuntime).join("\n"), /check:runtime/);

  const withoutStatefulCompat = new Map(docs);
  withoutStatefulCompat.set(
    "docs/real-device-verification.md",
    withoutStatefulCompat.get("docs/real-device-verification.md").replaceAll("npm run check:compat", "npm run removed-compat"),
  );
  assert.match(releaseEvidenceIssues(withoutStatefulCompat).join("\n"), /check:compat/);

  const withoutStatusReleaseGate = new Map(docs);
  withoutStatusReleaseGate.set(
    "docs/verification-status.md",
    removeLine(withoutStatusReleaseGate.get("docs/verification-status.md"), "- `npm run check:release`"),
  );
  assert.match(releaseEvidenceIssues(withoutStatusReleaseGate).join("\n"), /verification-status\.md missing release evidence command: npm run check:release/);

  const withoutIssueDryRunGate = new Map(docs);
  withoutIssueDryRunGate.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    withoutIssueDryRunGate.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace("`npm run test:dry-run`, ", ""),
  );
  assert.match(releaseEvidenceIssues(withoutIssueDryRunGate, pkg.scripts).join("\n"), /test:dry-run/);

  const withoutSwiftCli = new Map(docs);
  withoutSwiftCli.set(
    "docs/release-notes-template.md",
    withoutSwiftCli.get("docs/release-notes-template.md").replaceAll(/npm run check:swift-cli\r?\n/g, ""),
  );
  assert.match(releaseEvidenceIssues(withoutSwiftCli).join("\n"), /check:swift-cli/);

  const scriptsWithoutStrictAudio = { ...pkg.scripts };
  delete scriptsWithoutStrictAudio["check:audio:strict"];
  assert.match(releaseEvidenceIssues(docs, scriptsWithoutStrictAudio).join("\n"), /scripts\.check:audio:strict/);

  const scriptsWithoutNodeMonitor = { ...pkg.scripts };
  delete scriptsWithoutNodeMonitor["monitor:node"];
  assert.match(releaseEvidenceIssues(docs, scriptsWithoutNodeMonitor).join("\n"), /monitor:node/);

  const publicDocs = new Map([
    ["README.md", readFileSync("README.md", "utf8")],
    ["README.en.md", readFileSync("README.en.md", "utf8")],
    ["CONTRIBUTING.md", readFileSync("CONTRIBUTING.md", "utf8")],
    [".github/pull_request_template.md", readFileSync(".github/pull_request_template.md", "utf8")],
  ]);
  assert.deepEqual(npmRunReferenceIssues(publicDocs, pkg.scripts), []);
  const scriptsWithoutDryRun = { ...pkg.scripts };
  delete scriptsWithoutDryRun["test:dry-run"];
  assert.match(npmRunReferenceIssues(publicDocs, scriptsWithoutDryRun).join("\n"), /README\.md.*test:dry-run/);

  const withoutNpmCI = new Map(docs);
  withoutNpmCI.set(
    ".github/ISSUE_TEMPLATE/platform_verification.yml",
    withoutNpmCI.get(".github/ISSUE_TEMPLATE/platform_verification.yml").replace("`npm ci`, ", ""),
  );
  assert.match(releaseEvidenceIssues(withoutNpmCI, pkg.scripts).join("\n"), /npm ci/);

  const withoutMacDryRun = new Map(docs);
  withoutMacDryRun.set(
    "docs/release-notes-template.md",
    withoutMacDryRun.get("docs/release-notes-template.md").replaceAll(
      "./scripts/pet-rollout-monitor.command --once --dry-run",
      "./scripts/pet-rollout-monitor.command --removed-dry-run",
    ),
  );
  assert.match(releaseEvidenceIssues(withoutMacDryRun, pkg.scripts).join("\n"), /pet-rollout-monitor\.command --once --dry-run/);

  const withoutWindowsNodeDryRun = new Map(docs);
  withoutWindowsNodeDryRun.set(
    "docs/real-device-verification.md",
    withoutWindowsNodeDryRun.get("docs/real-device-verification.md").replaceAll(
      "npm run monitor:node -- --once --dry-run --rollout test/fixtures/assistant-rollout.jsonl",
      "npm run monitor:node -- --removed-dry-run --rollout test/fixtures/assistant-rollout.jsonl",
    ),
  );
  assert.match(releaseEvidenceIssues(withoutWindowsNodeDryRun, pkg.scripts).join("\n"), /monitor:node -- --once --dry-run/);

  const withoutLinuxSpeechFallback = new Map(docs);
  withoutLinuxSpeechFallback.set(
    "docs/release-notes-template.md",
    withoutLinuxSpeechFallback.get("docs/release-notes-template.md").replaceAll(
      "npm run monitor:node -- --tts say --speech-language zh --once --rollout test/fixtures/ko-zh-rollout.jsonl",
      "npm run monitor:node -- --tts say --speech-language removed --once --rollout test/fixtures/ko-zh-rollout.jsonl",
    ),
  );
  assert.match(releaseEvidenceIssues(withoutLinuxSpeechFallback, pkg.scripts).join("\n"), /speech-language zh/);
});

test("keeps platform graduation boundaries visible", () => {
  const releaseChecker = readFileSync("scripts/check-release-readiness.mjs", "utf8");
  assert.match(releaseChecker, /platformGraduationBoundaryChecks/);
  assert.match(releaseChecker, /not evidence for graduating Windows or Linux from experimental without audible, sanitized real-device output/);
  assert.match(releaseChecker, /not Windows \/ Linux graduation evidence/);
});

test("detects unsafe local config failure log drift", () => {
  const scripts = new Map([
    ["check.command", readFileSync("check.command", "utf8")],
    ["start-selected-tts.command", readFileSync("start-selected-tts.command", "utf8")],
    ["check.ps1", readFileSync("check.ps1", "utf8")],
    ["start-selected-tts.ps1", readFileSync("start-selected-tts.ps1", "utf8")],
    ["check.sh", readFileSync("check.sh", "utf8")],
    ["start-selected-tts.sh", readFileSync("start-selected-tts.sh", "utf8")],
  ]);
  assert.deepEqual(localConfigFailureLogIssues(scripts), []);

  const leakingPath = new Map(scripts);
  leakingPath.set(
    "check.sh",
    leakingPath.get("check.sh").replace("config: invalid format (.talking-pets.local.env)", "config: invalid format ($CONFIG_FILE)"),
  );
  assert.match(localConfigFailureLogIssues(leakingPath).join("\n"), /check\.sh.*CONFIG_FILE/);

  const leakingLine = new Map(scripts);
  leakingLine.set(
    "start-selected-tts.sh",
    leakingLine.get("start-selected-tts.sh").replace("Invalid line number: $line_number", "Invalid line: $line"),
  );
  assert.match(localConfigFailureLogIssues(leakingLine).join("\n"), /start-selected-tts\.sh.*Invalid line/);

  const leakingEndpoint = new Map(scripts);
  leakingEndpoint.set(
    "check.ps1",
    leakingEndpoint.get("check.ps1").replaceAll("Format-EndpointForLog", "Format-EndpointForDebug"),
  );
  assert.match(localConfigFailureLogIssues(leakingEndpoint).join("\n"), /check\.ps1.*Format-EndpointForLog/);
});

test("detects npm pack scope drift", () => {
  assert.equal(npmCommand(), process.platform === "win32" ? "npm.cmd" : "npm");
  assert.equal(shouldUseShellForNPM("win32"), true);
  assert.equal(shouldUseShellForNPM("darwin"), false);
  assert.equal(shouldUseShellForNPM("linux"), false);
  assert.equal(shouldCheckExecutableMode("win32"), false);
  assert.equal(shouldCheckExecutableMode("darwin"), true);
  assert.equal(shouldCheckExecutableMode("linux"), true);

  const pack = {
    size: 300_000,
    entryCount: 3,
    files: [
      { path: "README.md", mode: 0o644 },
      { path: "check.command", mode: 0o755 },
      { path: "implementation-notes.md", mode: 0o644 },
    ],
  };
  const issues = packIssues(pack).join("\n");
  assert.match(issues, /missing required file/);
  assert.match(issues, /forbidden implementation notes/);
  assert.equal(packIssues({
    size: 300_000,
    entryCount: 2,
    files: [
      { path: "README.md", mode: 0o644 },
      { path: "check.command", mode: 0o644 },
    ],
  }).join("\n").includes("lost executable bit"), true);
  assert.equal(packIssues({
    size: 300_000,
    entryCount: 2,
    files: [
      { path: "README.md", mode: 0o644 },
      { path: "check.command", mode: 0o644 },
    ],
  }, { checkExecutableMode: false }).join("\n").includes("lost executable bit"), false);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "scripts/pet-rollout-monitor.command", mode: 0o755 }],
  }).join("\n"), /missing required file: scripts\/pet-rollout-monitor-node\.command/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "presets/examples/generic-voicebox.env", mode: 0o644 }],
  }).join("\n"), /missing required file: presets\/examples\/ja-voicevox-zundamon\.env/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "README.md", mode: 0o644 }],
  }).join("\n"), /missing required file: SECURITY\.md/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "README.md", mode: 0o644 }],
  }).join("\n"), /missing required file: README\.en\.md/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "README.md", mode: 0o644 }],
  }).join("\n"), /missing required file: LICENSE/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "README.md", mode: 0o644 }],
  }).join("\n"), /missing required file: docs\/public-repo-review-checklist\.md/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "README.md", mode: 0o644 }],
  }).join("\n"), /missing required file: docs\/verification-status\.md/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "check.sh", mode: 0o755 }],
  }).join("\n"), /missing required file: install\.sh/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "scripts/check-npm-pack.mjs", mode: 0o644 }],
  }).join("\n"), /missing required file: scripts\/sanitize-public-output\.mjs/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "test/fixtures/assistant-rollout.jsonl", mode: 0o644 }],
  }).join("\n"), /missing required file: test\/fixtures\/mixed-ja-en-rollout\.jsonl/);
  const completePackIssues = packIssues({
    size: 300_000,
    entryCount: 62,
    files: [
      { path: ".talking-pets.local.env.example", mode: 0o644 },
      { path: "README.md", mode: 0o644 },
      { path: "README.en.md", mode: 0o644 },
      { path: "LICENSE", mode: 0o644 },
      { path: "CHANGELOG.md", mode: 0o644 },
      { path: "CONTRIBUTING.md", mode: 0o644 },
      { path: "CREDITS.md", mode: 0o644 },
      { path: "FUTURE_PLAN.md", mode: 0o644 },
      { path: "SECURITY.md", mode: 0o644 },
      { path: "assets/demo-preview.png", mode: 0o644 },
      { path: "check.command", mode: 0o755 },
      { path: "check.ps1", mode: 0o644 },
      { path: "check.sh", mode: 0o755 },
      { path: "demo/index.html", mode: 0o644 },
      { path: "docs/demo/talking-pets-overlay-2026-05-28-frame.png", mode: 0o644 },
      { path: "docs/public-repo-review-checklist.md", mode: 0o644 },
      { path: "docs/real-device-verification.md", mode: 0o644 },
      { path: "docs/release-notes-template.md", mode: 0o644 },
      { path: "docs/verification-status.md", mode: 0o644 },
      { path: "install.command", mode: 0o755 },
      { path: "install.ps1", mode: 0o644 },
      { path: "install.sh", mode: 0o755 },
      { path: "package.json", mode: 0o644 },
      { path: "presets/examples/en-kokoro-heart.env", mode: 0o644 },
      { path: "presets/examples/generic-voicebox.env", mode: 0o644 },
      { path: "presets/examples/ja-voicevox-zundamon.env", mode: 0o644 },
      { path: "presets/examples/ko-say-fallback.env", mode: 0o644 },
      { path: "presets/examples/privacy-first-say.env", mode: 0o644 },
      { path: "presets/examples/zh-say-fallback.env", mode: 0o644 },
      { path: "presets/speech-style.json", mode: 0o644 },
      { path: "presets/voices.json", mode: 0o644 },
      { path: "scripts/audio-platform.mjs", mode: 0o644 },
      { path: "scripts/check-audio-path.mjs", mode: 0o644 },
      { path: "scripts/check-codex-compat.mjs", mode: 0o644 },
      { path: "scripts/check-config-files.mjs", mode: 0o644 },
      { path: "scripts/check-installer-configs.mjs", mode: 0o644 },
      { path: "scripts/check-markdown-links.mjs", mode: 0o644 },
      { path: "scripts/check-node-runtime.mjs", mode: 0o644 },
      { path: "scripts/check-npm-pack.mjs", mode: 0o644 },
      { path: "scripts/check-public-output-sanitizer.mjs", mode: 0o644 },
      { path: "scripts/check-platform-scripts.mjs", mode: 0o644 },
      { path: "scripts/check-release-readiness.mjs", mode: 0o644 },
      { path: "scripts/check-swift-cli.mjs", mode: 0o644 },
      { path: "scripts/latency-lines-to-table.mjs", mode: 0o644 },
      { path: "scripts/sanitize-public-output.mjs", mode: 0o644 },
      { path: "scripts/pet-rollout-monitor-node.command", mode: 0o755 },
      { path: "scripts/pet-rollout-monitor.command", mode: 0o755 },
      { path: "scripts/pet-rollout-monitor.mjs", mode: 0o644 },
      { path: "scripts/pet-rollout-monitor.swift", mode: 0o644 },
      { path: "scripts/tts-kokoro.mjs", mode: 0o644 },
      { path: "scripts/tts-voicebox.mjs", mode: 0o644 },
      { path: "scripts/tts-melotts.mjs", mode: 0o644 },
      { path: "scripts/wav-duration.mjs", mode: 0o644 },
      { path: "src/talking-pet-mvp.js", mode: 0o644 },
      { path: "start-selected-tts.command", mode: 0o755 },
      { path: "start-selected-tts.ps1", mode: 0o644 },
      { path: "start-selected-tts.sh", mode: 0o755 },
      { path: "test/fixtures/assistant-rollout.jsonl", mode: 0o644 },
      { path: "test/fixtures/mixed-ja-en-rollout.jsonl", mode: 0o644 },
      { path: "test/fixtures/ko-zh-rollout.jsonl", mode: 0o644 },
    ],
  }).join("\n");
  assert.doesNotMatch(completePackIssues, /forbidden (tests|private rollout JSONL)/);
  assert.doesNotMatch(completePackIssues, /missing required file/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "cache/metadata.sqlite3", mode: 0o644 }],
  }).join("\n"), /forbidden SQLite DB/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: ".DS_Store", mode: 0o644 }],
  }).join("\n"), /forbidden macOS metadata/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "sessions/private-rollout.jsonl", mode: 0o644 }],
  }).join("\n"), /forbidden private rollout JSONL/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "test/fixtures/private-rollout.jsonl", mode: 0o644 }],
  }).join("\n"), /forbidden (tests|private rollout JSONL)/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "local-experimental/bridge.html", mode: 0o644 }],
  }).join("\n"), /forbidden local experimental folder/);
  assert.match(packIssues({
    size: 300_000,
    entryCount: 1,
    files: [{ path: "node_modules/kokoro-js/index.js", mode: 0o644 }],
  }).join("\n"), /forbidden dependency folder/);

  const missingFrame = new Map([
    ["README.md", { path: "README.md", mode: 0o644 }],
    ["assets/demo-preview.png", { path: "assets/demo-preview.png", mode: 0o644 }],
  ]);
  assert.match(packageDocumentLinkIssues(missingFrame).join("\n"), /docs\/demo\/talking-pets-overlay-2026-05-28-frame\.png/);

  const escapingDir = mkdtempSync(join(tmpdir(), "talking-pets-pack-doc-"));
  const escapingPath = join(escapingDir, "readme.md");
  writeFileSync(escapingPath, "[outside](../outside.txt)\n");
  const escapingDoc = new Map([[escapingPath, { path: escapingPath, mode: 0o644 }]]);
  assert.match(packageDocumentLinkIssues(escapingDoc).join("\n"), /link escapes package/);

  const anchorDir = mkdtempSync(join(tmpdir(), "talking-pets-pack-anchor-"));
  const anchorPath = join(anchorDir, "CONTRIBUTING.md");
  writeFileSync(anchorPath, "# Contributing\n\n## Issues\n\n");
  const anchorReadmePath = join(anchorDir, "README.md");
  writeFileSync(anchorReadmePath, "[Issues](CONTRIBUTING.md#issues)\n");
  const anchorFiles = new Map([
    [anchorPath, { path: anchorPath, mode: 0o644 }],
    [anchorReadmePath, { path: anchorReadmePath, mode: 0o644 }],
  ]);
  assert.deepEqual(packageDocumentLinkIssues(anchorFiles), []);
  writeFileSync(anchorReadmePath, "[Missing](CONTRIBUTING.md#missing)\n");
  assert.match(packageDocumentLinkIssues(anchorFiles).join("\n"), /missing packaged anchor/);
});

test("detects package-lock root metadata drift", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
  assert.deepEqual(packageLockIssues(pkg, lock), []);

  const lockWithWrongEngine = structuredClone(lock);
  lockWithWrongEngine.packages[""].engines.node = ">=20";
  assert.match(packageLockIssues(pkg, lockWithWrongEngine).join("\n"), /engines\.node/);

  const lockWithWrongDependency = structuredClone(lock);
  lockWithWrongDependency.packages[""].dependencies["kokoro-js"] = "^0.1.0";
  assert.match(packageLockIssues(pkg, lockWithWrongDependency).join("\n"), /kokoro-js/);

  const lockWithExtraDependency = structuredClone(lock);
  lockWithExtraDependency.packages[""].dependencies["unused-local-tts"] = "^1.0.0";
  assert.match(packageLockIssues(pkg, lockWithExtraDependency).join("\n"), /unused-local-tts/);
});

test("validates local env keys without accepting unrelated environment variables", () => {
  assert.equal(allowedEnvKeys.has("TALKING_PETS_TTS"), true);
  assert.equal(allowedEnvKeys.has("TALKING_PETS_VOICEBOX_MODE"), true);
  assert.equal(allowedEnvKeys.has("TALKING_PETS_SPEECH_LANGUAGE"), true);
  assert.equal(allowedEnvKeys.has("NODE_OPTIONS"), false);

  const valid = validateEnvText([
    'TALKING_PETS_TTS="say"',
    'TALKING_PETS_VOICEVOX_URL="http://127.0.0.1:50021"',
  ].join("\n"), "valid.env");
  assert.deepEqual(valid.errors, []);
  assert.equal(valid.values.TALKING_PETS_TTS, "say");

  for (const [file, expected] of Object.entries({
    "presets/examples/en-kokoro-heart.env": { tts: "kokoro", ui: "en", speech: "en" },
    "presets/examples/generic-voicebox.env": { tts: "voicebox", ui: "en", speech: "en", voiceboxMode: "generic", voiceboxProfile: "default", voiceboxLanguage: "en" },
    "presets/examples/ja-voicevox-zundamon.env": { tts: "voicevox", ui: "ja", speech: "ja" },
    "presets/examples/ko-say-fallback.env": { tts: "say", ui: "en", speech: "ko" },
    "presets/examples/privacy-first-say.env": { tts: "say", ui: "en", speech: "auto" },
    "presets/examples/zh-say-fallback.env": { tts: "say", ui: "en", speech: "zh" },
  })) {
    const parsed = validateEnvText(readFileSync(file, "utf8"), file);
    assert.deepEqual(parsed.errors, []);
    assert.equal(parsed.values.TALKING_PETS_TTS, expected.tts);
    assert.equal(parsed.values.TALKING_PETS_UI_LANGUAGE, expected.ui);
    assert.equal(parsed.values.TALKING_PETS_SPEECH_LANGUAGE, expected.speech);
    if (expected.voiceboxMode) assert.equal(parsed.values.TALKING_PETS_VOICEBOX_MODE, expected.voiceboxMode);
    if (expected.voiceboxProfile) assert.equal(parsed.values.TALKING_PETS_VOICEBOX_PROFILE, expected.voiceboxProfile);
    if (expected.voiceboxLanguage) assert.equal(parsed.values.TALKING_PETS_VOICEBOX_LANGUAGE, expected.voiceboxLanguage);
  }

  const bom = validateEnvText('\uFEFFTALKING_PETS_TTS="say"\n', "bom.env");
  assert.deepEqual(bom.errors, []);
  assert.equal(bom.values.TALKING_PETS_TTS, "say");

  const invalid = validateEnvText([
    'NODE_OPTIONS="--inspect"',
    "TALKING_PETS_TTS=say",
  ].join("\n"), "bad.env");
  assert.match(invalid.errors[0], /unsupported key: NODE_OPTIONS/);
  assert.match(invalid.errors[1], /must use KEY="value" format/);

  const configChecker = readFileSync("scripts/check-config-files.mjs", "utf8");
  assert.match(configChecker, /"install\.command"/);
  assert.match(configChecker, /"install\.sh"/);
  assert.match(configChecker, /"install\.ps1"/);
  assert.match(configChecker, /"TALKING_PETS_SPEECH_LANGUAGE"/);
  assert.match(configChecker, /expectedVoiceboxProfile: "default"/);
  assert.match(configChecker, /expectedVoiceboxLanguage: "en"/);
  assert.match(configChecker, /expectedSpeechLanguage: "en"/);
  assert.match(configChecker, /allowMissingSpeechLanguage/);
});

test("validates config URL helpers", () => {
  assert.equal(isHTTPURL("http://127.0.0.1:50021"), true);
  assert.equal(isHTTPURL("https://localhost:50021"), true);
  assert.equal(isHTTPURL("file:///tmp/voicevox"), false);
  assert.equal(isHTTPURL("not a url"), false);
});

test("validates local env values before startup", () => {
  assert.deepEqual(validateEnvValues({
    TALKING_PETS_TTS: "auto",
    TALKING_PETS_VOICEVOX_URL: "http://127.0.0.1:50021",
    TALKING_PETS_VOICEVOX_SPEAKER: "3",
    TALKING_PETS_VOICEBOX_MODE: "generic",
    TALKING_PETS_VOICEBOX_PROFILE: "default",
    TALKING_PETS_VOICEBOX_LANGUAGE: "en",
    TALKING_PETS_KOKORO_VOICE: "af_heart",
    TALKING_PETS_SAY_VOICE: "Kyoko",
    TALKING_PETS_LANGUAGE_ROUTE: "1",
    TALKING_PETS_SPEECH_LANGUAGE: "zh",
    TALKING_PETS_UI_LANGUAGE: "ja",
  }, "valid.env"), []);

  const errors = validateEnvValues({
    TALKING_PETS_TTS: "remote",
    TALKING_PETS_VOICEVOX_URL: "file:///tmp/voicevox",
    TALKING_PETS_VOICEVOX_SPEAKER: "zundamon",
    TALKING_PETS_VOICEBOX_MODE: "remote",
    TALKING_PETS_VOICEBOX_PROFILE: "",
    TALKING_PETS_VOICEBOX_LANGUAGE: " ",
    TALKING_PETS_KOKORO_VOICE: "",
    TALKING_PETS_SAY_VOICE: " ",
    TALKING_PETS_LANGUAGE_ROUTE: "yes",
    TALKING_PETS_SPEECH_LANGUAGE: "fr",
    TALKING_PETS_UI_LANGUAGE: "fr",
  }, "bad.env");
  assert.equal(errors.length, 11);
  assert.match(errors.join("\n"), /valid http\(s\) URL/);
  assert.match(errors.join("\n"), /numeric speaker\/style id/);
  assert.match(errors.join("\n"), /VOICEBOX_MODE must be voicevox or generic/);
});

test("extracts markdown and HTML document links", () => {
  const links = documentLinks(`
![Preview](assets/demo-preview.png)
[With Space](<docs/My File.md>)
[Ref]: docs/reference-guide.md
[Ref Space]: <docs/Reference Guide.md>
<!-- [Ignored Comment](comment-missing.md) -->
<!--
[Ignored Comment Ref]: comment-ref-missing.md
<img src="comment-missing.png">
-->
<!-- ~~~md -->
[After Comment Fence](docs/after-comment-fence.md)
[After Comment](docs/after-comment.md) <!-- [Ignored Inline](inline-missing.md) --> <a href="docs/after-inline-comment.md">after</a>
~~~md
[Ignored](missing.md)
[Ignored Ref]: missing-ref.md
<img src="missing.png">
~~~
<video src="docs/demo/talking-pets-overlay-2026-05-28.mov">
  <a href='docs/demo/talking-pets-overlay-2026-05-28.mov'>demo</a>
</video>
<script src="/path/to/talking-pet-mvp.js"></script>
`);
  assert.deepEqual(
    links.map(link => link.target),
    [
      "assets/demo-preview.png",
      "docs/My File.md",
      "docs/after-comment-fence.md",
      "docs/after-comment.md",
      "docs/reference-guide.md",
      "docs/Reference Guide.md",
      "docs/after-inline-comment.md",
      "docs/demo/talking-pets-overlay-2026-05-28.mov",
      "docs/demo/talking-pets-overlay-2026-05-28.mov",
      "/path/to/talking-pet-mvp.js",
    ],
  );
  assert.equal(shouldSkip("/path/to/talking-pet-mvp.js"), true);
  assert.equal(shouldSkip("docs/demo/talking-pets-overlay-2026-05-28.mov"), false);
  assert.equal(shouldSkip("#issues"), false);
  assert.equal(documentAnchors("# Contributing\n\n## Issues\n\n<h2 id=\"custom-anchor\">Custom</h2>\n").has("issues"), true);
  assert.equal(documentAnchors("# Contributing\n\n## Issues\n\n<h2 id=\"custom-anchor\">Custom</h2>\n").has("custom-anchor"), true);

  const spacedDir = mkdtempSync(join(tmpdir(), "talking-pets-doc-link-space-"));
  const spacedTargetPath = join(spacedDir, "My File.md");
  const referenceTargetPath = join(spacedDir, "Reference Guide.md");
  const spacedReadmePath = join(spacedDir, "README.md");
  writeFileSync(spacedTargetPath, "# My File\n");
  writeFileSync(referenceTargetPath, "# Reference Guide\n");
  writeFileSync(spacedReadmePath, "[With Space](<My File.md>)\n[Ref]: <Reference Guide.md>\n");
  assert.deepEqual(packageDocumentLinkIssues(new Map([
    [spacedTargetPath, { path: spacedTargetPath, mode: 0o644 }],
    [referenceTargetPath, { path: referenceTargetPath, mode: 0o644 }],
    [spacedReadmePath, { path: spacedReadmePath, mode: 0o644 }],
  ])), []);
  assert.deepEqual(stripHtmlComments("before <!-- [hidden](missing.md) --> after", { htmlComment: false }), {
    line: "before  after",
    htmlComment: false,
  });
  assert.deepEqual(stripHtmlComments("hidden](missing.md) --> after", { htmlComment: true }), {
    line: " after",
    htmlComment: false,
  });
});

function tempRollout(objects) {
  const dir = mkdtempSync(join(tmpdir(), "talking-pets-test-"));
  const path = join(dir, "rollout.jsonl");
  writeFileSync(path, `${objects.map(object => JSON.stringify(object)).join("\n")}\n`);
  return path;
}

function samplePCM16Wav({ sampleRate, channels, durationSeconds }) {
  const bitsPerSample = 16;
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const dataSize = Math.round(byteRate * durationSeconds);
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0, "ascii");
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8, "ascii");
  buffer.write("fmt ", 12, "ascii");
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36, "ascii");
  buffer.writeUInt32LE(dataSize, 40);
  return buffer;
}

function removeLine(text, line) {
  return text.replace(new RegExp(`${escapeRegExp(line)}\\r?\\n`, "g"), "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
