#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { performance } from "node:perf_hooks";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

import { windowsPowerShellCommand } from "./audio-platform.mjs";
import { providerCapabilityForRouting, providerCapabilitySummary } from "../src/provider-capabilities.js";
import { applyUserPreferences, loadUserPreferences, preferredProviderForLanguage } from "../src/user-preferences.js";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = dirname(scriptPath);
const optionFlags = new Set([
  "--help",
  "-h",
  "--version",
  "-v",
  "--voice",
  "--tts",
  "--kokoro-voice",
  "--kokoro-dtype",
  "--kokoro-device",
  "--irodori-url",
  "--irodori-voice",
  "--irodori-model",
  "--irodori-format",
  "--melotts-url",
  "--melotts-command",
  "--melotts-health-arg",
  "--melotts-timeout-ms",
  "--voicebox-url",
  "--voicebox-mode",
  "--voicebox-speaker",
  "--voicebox-profile",
  "--voicebox-language",
  "--speech-language",
  "--speech-style",
  "--preferences",
  "--language-route",
  "--no-language-route",
  "--rate",
  "--interval",
  "--thread-id",
  "--cwd",
  "--rollout",
  "--state-db",
  "--max-source-chars",
  "--skip-existing",
  "--no-summary",
  "--dry-run",
  "--once",
  "--list-voices",
  "--list-provider-capabilities",
  "--profile-latency",
  "--diagnose-routing",
  "--show-private-paths",
]);

async function main(argv = process.argv.slice(2)) {
  const options = parseOptions(argv);
  const preferenceState = loadUserPreferences(options.preferencesPath);
  const runtimeOptions = applyUserPreferences(options, preferenceState);

  if (runtimeOptions.listProviderCapabilities) {
    printProviderCapabilities();
    return;
  }

  if (runtimeOptions.listVoices) {
    listVoices(runtimeOptions);
    return;
  }

  if (runtimeOptions.version) {
    printVersion();
    return;
  }

  let lastThread = null;
  let lastSpokenKey = null;
  let didSkipExisting = false;

  while (true) {
    const latencyProfile = startLatencyProfile(runtimeOptions.profileLatency);
    const thread = await measureLatency(latencyProfile, "resolveThread", () => resolveThread(runtimeOptions));
    if (!thread) {
      console.log("[wait] Codex thread not found");
      printLatencyProfile(latencyProfile, { candidate: false, dryRun: runtimeOptions.dryRun, thread: false });
      if (runtimeOptions.once) break;
      await sleep(runtimeOptions.interval * 1000);
      continue;
    }

    if (!lastThread || thread.id !== lastThread.id || thread.rolloutPath !== lastThread.rolloutPath) {
      console.log(`[thread] ${thread.title} / ${thread.id}`);
      console.log(`[rollout] ${displayPrivatePath(thread.rolloutPath, runtimeOptions)}`);
      lastThread = thread;
      lastSpokenKey = null;
      didSkipExisting = false;
    }

    const speechResult = measureLatency(latencyProfile, "readLatestSpeechCandidate", () => readLatestSpeechCandidate(thread.rolloutPath, runtimeOptions.maxSourceCharacters, runtimeOptions));
    const candidate = speechResult.candidate;
    if (candidate) {
      const key = normalizedKey(candidate.text);
      if (runtimeOptions.skipExisting && !didSkipExisting) {
        lastSpokenKey = key;
        didSkipExisting = true;
        console.log(`[skip-existing] ${candidate.source} / ${candidate.timestamp}`);
      } else if (key !== lastSpokenKey) {
        const speech = measureLatency(latencyProfile, "speechText", () => speechText(candidate.text, runtimeOptions));
        console.log(`[source] ${candidate.text}`);
        console.log(`[pet] ${speech}`);
        if (runtimeOptions.diagnoseRouting) {
          console.log(JSON.stringify(routingDiagnostic(candidate.text, speech, runtimeOptions), null, 2));
        }
        lastSpokenKey = key;
        if (!runtimeOptions.dryRun) {
          measureLatency(latencyProfile, "speak", () => speak(speech, runtimeOptions));
        }
      }
    } else {
      console.log(`[wait] ${speechResult.message}`);
    }

    printLatencyProfile(latencyProfile, { candidate: Boolean(candidate), dryRun: runtimeOptions.dryRun, thread: true });
    if (runtimeOptions.once) break;
    await sleep(runtimeOptions.interval * 1000);
  }
}

if (process.argv[1] === scriptPath) {
  main().catch(error => {
    console.error(error?.message ?? String(error));
    process.exit(1);
  });
}

function parseOptions(argv) {
  const result = {
    interval: 1,
    voice: "Kyoko",
    ttsEngine: "auto",
    kokoroVoice: "af_heart",
    kokoroDtype: "q8",
    kokoroDevice: "cpu",
    irodoriURL: "http://127.0.0.1:8088",
    irodoriVoice: "none",
    irodoriModel: "irodori-tts",
    irodoriFormat: "wav",
    melottsURL: null,
    melottsCommand: null,
    melottsHealthArg: null,
    melottsTimeoutMs: null,
    voiceboxURL: "http://127.0.0.1:50021",
    voiceboxMode: "voicevox",
    voiceboxSpeaker: "3",
    voiceboxProfile: null,
    voiceboxLanguage: null,
    speechLanguage: "auto",
    speechStylePath: join(dirname(scriptDir), "presets", "speech-style.json"),
    preferencesPath: null,
    languageRoute: false,
    rate: 185,
    dryRun: false,
    listVoices: false,
    listProviderCapabilities: false,
    version: false,
    once: false,
    summarizeSpeech: true,
    skipExisting: false,
    profileLatency: false,
    diagnoseRouting: false,
    maxSourceCharacters: 4000,
    stateDB: null,
    rolloutPath: null,
    threadId: null,
    cwd: null,
    showPrivatePaths: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const takeValue = () => {
      const value = argv[i + 1];
      if (value == null || optionFlags.has(value)) throw new Error(`${arg} requires a value`);
      i += 1;
      return value;
    };

    switch (arg) {
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      case "--version":
      case "-v":
        result.version = true;
        break;
      case "--voice":
        result.voice = takeValue();
        break;
      case "--tts":
        result.ttsEngine = choiceValue("--tts", takeValue(), ["auto", "voicevox", "voicebox", "kokoro", "irodori", "melotts", "say"]);
        break;
      case "--kokoro-voice":
        result.kokoroVoice = takeValue();
        break;
      case "--kokoro-dtype":
        result.kokoroDtype = takeValue();
        break;
      case "--kokoro-device":
        result.kokoroDevice = takeValue();
        break;
      case "--irodori-url":
        result.irodoriURL = takeValue();
        break;
      case "--irodori-voice":
        result.irodoriVoice = takeValue();
        break;
      case "--irodori-model":
        result.irodoriModel = takeValue();
        break;
      case "--irodori-format":
        result.irodoriFormat = takeValue();
        break;
      case "--melotts-url":
        result.melottsURL = takeValue();
        break;
      case "--melotts-command":
        result.melottsCommand = takeValue();
        break;
      case "--melotts-health-arg":
        result.melottsHealthArg = takeValue();
        break;
      case "--melotts-timeout-ms":
        result.melottsTimeoutMs = positiveIntegerValue("--melotts-timeout-ms", takeValue());
        break;
      case "--voicebox-url":
        result.voiceboxURL = takeValue();
        break;
      case "--voicebox-mode":
        result.voiceboxMode = choiceValue("--voicebox-mode", takeValue(), ["voicevox", "generic"]);
        break;
      case "--voicebox-speaker":
        result.voiceboxSpeaker = takeValue();
        break;
      case "--voicebox-profile":
        result.voiceboxProfile = takeValue();
        break;
      case "--voicebox-language":
        result.voiceboxLanguage = takeValue();
        break;
      case "--speech-language":
        result.speechLanguage = choiceValue("--speech-language", takeValue(), ["auto", "ja", "en", "ko", "zh", "other"]);
        break;
      case "--speech-style":
        result.speechStylePath = takeValue();
        break;
      case "--preferences":
        result.preferencesPath = takeValue();
        break;
      case "--language-route":
        result.languageRoute = true;
        break;
      case "--no-language-route":
        result.languageRoute = false;
        break;
      case "--rate":
        result.rate = positiveNumberValue("--rate", takeValue());
        break;
      case "--interval":
        result.interval = positiveNumberValue("--interval", takeValue());
        break;
      case "--thread-id":
        result.threadId = takeValue();
        break;
      case "--cwd":
        result.cwd = takeValue();
        break;
      case "--rollout":
        result.rolloutPath = takeValue();
        break;
      case "--state-db":
        result.stateDB = takeValue();
        break;
      case "--max-source-chars":
        result.maxSourceCharacters = positiveIntegerValue("--max-source-chars", takeValue());
        break;
      case "--skip-existing":
        result.skipExisting = true;
        break;
      case "--no-summary":
        result.summarizeSpeech = false;
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
      case "--once":
        result.once = true;
        break;
      case "--list-voices":
        result.listVoices = true;
        break;
      case "--list-provider-capabilities":
        result.listProviderCapabilities = true;
        break;
      case "--profile-latency":
        result.profileLatency = true;
        break;
      case "--diagnose-routing":
        result.diagnoseRouting = true;
        result.dryRun = true;
        break;
      case "--show-private-paths":
        result.showPrivatePaths = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return result;
}

function choiceValue(flag, value, allowed) {
  const normalized = value.toLowerCase();
  if (!allowed.includes(normalized)) {
    throw new Error(`${flag} must be one of: ${allowed.join(", ")}`);
  }
  return normalized;
}

function positiveNumberValue(flag, value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${flag} must be a positive number`);
  }
  return number;
}

function positiveIntegerValue(flag, value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return number;
}

function printUsage() {
  console.log(`Usage:
  node scripts/pet-rollout-monitor.mjs [options]

Common:
  --once                         Check once and exit
  --dry-run                      Print the spoken line without playing audio
  --profile-latency              Print timing details to stderr
  --diagnose-routing             Print routing diagnostics as JSON and force dry-run
  --skip-existing                Do not speak the current existing latest message
  --interval SECONDS             Polling interval (default: 1)
  --help                         Show this help
  --version                      Print package version

Codex source:
  --thread-id ID                 Select a Codex thread
  --cwd PATH                     Select the latest thread for a workspace path
  --rollout PATH                 Read a rollout JSONL file directly
  --state-db PATH                Read a custom state_5.sqlite
  --max-source-chars N           Ignore source messages longer than N (default: 4000)
  --show-private-paths           Print full local paths in diagnostics

Speech:
  --no-summary                   Speak the full source text
  --speech-language LANG         auto, ja, en, ko, zh, or other
  --speech-style PATH            JSON style config for spoken phrasing
  --preferences PATH             JSON user preference config; no secrets or API keys

TTS:
  --tts auto|voicevox|voicebox|kokoro|irodori|melotts|say Select TTS engine (default: auto)
  --language-route               Route by detected language
  --no-language-route            Use the selected TTS without language routing
  --list-voices                  List voices for the selected TTS
  --list-provider-capabilities   Print provider/language capability metadata as JSON
  --voice NAME                   macOS say voice (default: Kyoko)
  --voicebox-url URL             VOICEVOX or compatible local endpoint
  --voicebox-speaker ID          VOICEVOX speaker/style id (default: 3)
  --kokoro-voice ID              Kokoro voice id (default: af_heart)
  --irodori-url URL              Irodori-TTS-Server URL (default: http://127.0.0.1:8088)
  --irodori-voice ID             Irodori voice id (default: none)
  --melotts-url URL              MeloTTS external runtime health URL
  --melotts-command PATH         MeloTTS external health command
  --melotts-health-arg ARG       MeloTTS health command arg (default: helper default)
  --melotts-timeout-ms N         MeloTTS health timeout in milliseconds

Examples:
  node scripts/pet-rollout-monitor.mjs --once --dry-run
  node scripts/pet-rollout-monitor.mjs --tts auto --skip-existing
  node scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-zh-rollout.jsonl
  node scripts/pet-rollout-monitor.mjs --rollout test/fixtures/assistant-rollout.jsonl --once --dry-run`);
}

function printVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(dirname(scriptDir), "package.json"), "utf8"));
    console.log(pkg.version ?? "0.0.0");
  } catch {
    console.log("0.0.0");
  }
}

async function resolveThread(opts) {
  if (opts.rolloutPath) {
    return { id: "manual-rollout", title: "manual rollout", rolloutPath: opts.rolloutPath };
  }

  const dbPath = opts.stateDB ?? defaultStateDBPath();
  if (!dbPath || !existsSync(dbPath)) return null;

  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    const where = opts.threadId
      ? "id = ?"
      : opts.cwd
        ? "cwd = ? and archived = 0"
        : "archived = 0 and title not like 'The following is the Codex agent history whose request action you are assessing.%'";
    const params = opts.threadId ? [opts.threadId] : opts.cwd ? [opts.cwd] : [];
    const query = `
      select id, replace(title, char(31), ' ') as title, rollout_path as rolloutPath
      from threads
      where ${where}
        and rollout_path is not null
        and rollout_path != ''
      order by coalesce(updated_at_ms, updated_at, 0) desc
      limit 1
    `;
    return db.prepare(query).get(...params) ?? null;
  } finally {
    db.close();
  }
}

function defaultStateDBPath() {
  const codexHome = process.env.CODEX_HOME;
  if (codexHome) return join(codexHome, "state_5.sqlite");
  return join(homedir(), ".codex", "state_5.sqlite");
}

function readLatestSpeechCandidate(rolloutPath, maxSourceCharacters, opts = {}) {
  let text;
  try {
    text = readFileSync(rolloutPath, "utf8");
  } catch (error) {
    const displayPath = displayPrivatePath(rolloutPath, opts);
    const detail = error?.code ? `${error.code}: ${displayPath}` : redactPrivatePaths(error?.message ?? String(error), [rolloutPath], opts);
    return speechMiss(`rollout unreadable (${detail})`);
  }

  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    return speechMiss("rollout is empty");
  }

  let parseErrors = 0;
  let nonSpeechLines = 0;
  let oversizedCandidates = 0;
  let latestOversizedLength = 0;

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    try {
      const object = JSON.parse(lines[i]);
      const candidate = speechCandidate(object);
      if (candidate && candidate.text.length <= maxSourceCharacters) {
        return { candidate, message: "ok" };
      }
      if (candidate) {
        oversizedCandidates += 1;
        latestOversizedLength = Math.max(latestOversizedLength, candidate.text.length);
      } else {
        nonSpeechLines += 1;
      }
    } catch {
      parseErrors += 1;
    }
  }

  if (oversizedCandidates > 0) {
    return speechMiss(`speech candidate too long (${latestOversizedLength} chars, max ${maxSourceCharacters}); use --max-source-chars to raise the limit`);
  }
  if (parseErrors === lines.length) {
    return speechMiss(`rollout has no parseable JSON lines (${parseErrors} parse errors)`);
  }
  if (parseErrors > 0) {
    return speechMiss(`speech candidate not found (${parseErrors} JSON parse errors skipped, ${nonSpeechLines} non-speech lines skipped)`);
  }
  return speechMiss(`speech candidate not found (${nonSpeechLines} non-speech lines skipped)`);
}

function speechMiss(message) {
  return { candidate: null, message };
}

function displayPrivatePath(path, opts = {}) {
  if (opts.showPrivatePaths) return path;
  return path && isAbsolute(path) ? "<redacted path>" : path;
}

function redactPrivatePaths(message, paths = [], opts = {}) {
  if (opts.showPrivatePaths) return String(message ?? "");
  let result = String(message ?? "");
  for (const path of paths.filter(Boolean)) {
    if (isAbsolute(path)) result = result.split(path).join("<redacted path>");
  }
  return result;
}

function speechCandidate(object) {
  const payload = object?.payload;
  const timestamp = object?.timestamp ?? "";
  if (!payload) return null;

  if (object.type === "event_msg" && payload.type === "agent_message" && typeof payload.message === "string") {
    return candidate(timestamp, "event_msg:agent_message", payload.message);
  }

  if (object.type === "response_item" && payload.type === "message" && payload.role === "assistant") {
    const text = Array.isArray(payload.content)
      ? payload.content.map(item => item.text ?? item.output_text ?? "").filter(Boolean).join("\n")
      : "";
    return candidate(timestamp, "response_item:message", text);
  }

  return null;
}

function candidate(timestamp, source, text) {
  const normalized = textForSource(text);
  if (normalized.length < 2) return null;
  return { timestamp, source, text: normalized };
}

function textForSource(text) {
  return text
    .replaceAll("\uFFFC", "")
    .replaceAll("\r", "\n")
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function speechText(sourceText, opts) {
  return opts.summarizeSpeech ? cuteSpeechSummary(sourceText, opts) : sourceText;
}

function cuteSpeechSummary(text, opts = parseOptions([])) {
  const prose = proseForSummary(text);
  if (!prose) return "New message.";
  const sentence = summarySegment(prose);
  const limit = isMixedJapaneseEnglish(prose) ? 160 : (prose.length <= 80 ? 72 : 64);
  const language = detectedLanguage(prose);
  const style = speechStyleFor(language, opts);
  const core = speechCore(trimmedPhrase(sentence, limit), style);
  if (!core) return style.fallback ?? "New message.";
  return cleanSpeechLine(variedSpeechLine(core, prose, style), language);
}

function proseForSummary(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/(^|\s)[-*]\s+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstUsefulSentence(text) {
  for (const part of text.split(/[。！？!?]/)) {
    const trimmed = part.trim();
    if (trimmed.length >= 8) return trimmed;
  }
  return text.trim();
}

function summarySegment(text) {
  if (!isMixedJapaneseEnglish(text)) return firstUsefulSentence(text);

  const useful = text
    .split(/[。！？!?]/)
    .map(part => part.trim())
    .filter(part => part.length >= 8);

  return useful.length >= 2 ? useful.slice(0, 2).join("。 ") : firstUsefulSentence(text);
}

function isMixedJapaneseEnglish(text) {
  let hasJapanese = false;
  let latin = 0;
  for (const char of text) {
    const value = char.codePointAt(0);
    if ((value >= 0x3040 && value <= 0x30ff) || (value >= 0x4e00 && value <= 0x9fff)) hasJapanese = true;
    else if ((value >= 0x41 && value <= 0x5a) || (value >= 0x61 && value <= 0x7a)) latin += 1;
  }
  return hasJapanese && latin >= 8;
}

function trimmedPhrase(text, maxCharacters) {
  return text.length <= maxCharacters ? text : `${text.slice(0, maxCharacters).trim()}...`;
}

function speechCore(text, style) {
  const stripTerms = style.stripTerms ?? [];
  let result = text;
  for (const term of stripTerms) {
    result = result.replaceAll(term, "");
  }

  return result
    .replace(/([、,])\s*([。！？!?])/g, "$2")
    .replace(/^[、,。\s]+/g, "")
    .replace(/[、,\s]+$/g, "")
    .replace(/\s*[、,]\s*[、,]\s*/g, "、")
    .replace(/\s+/g, " ")
    .trim();
}

function variedSpeechLine(core, seed, style) {
  const phrase = core
    .trim()
    .replace(/[、,。！？!?. ]+$/g, "")
    .replace(new RegExp(`^(${(style.stripPrefixes ?? []).map(escapeRegExp).join("|")})[、,\\s]+`, "u"), "")
    .replace(/[、,\s]+$/g, "")
    .trim();
  if (!phrase) return style.fallback ?? "New message.";

  const templates = style.templates?.length ? style.templates : ["{text}"];
  const template = templates[stableIndex(seed, templates.length)];
  return template.replaceAll("{text}", phrase);
}

function cleanSpeechLine(text, language) {
  let result = text
    .replace(/[、,]\s*([。！？!?])/g, "$1")
    .replace(/([。！？!?]){2,}/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[、,\s]+|[、,\s]+$/g, "");
  if (!/[。！？!?.?]$/.test(result)) {
    result += ["ja", "zh"].includes(language) ? "。" : ".";
  }
  return result;
}

function speechStyleFor(language, opts) {
  const config = readSpeechStyle(opts.speechStylePath);
  return config.languages?.[language] ?? config.languages?.fallback ?? DEFAULT_SPEECH_STYLE.languages.fallback;
}

function readSpeechStyle(path) {
  if (!path) return DEFAULT_SPEECH_STYLE;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return DEFAULT_SPEECH_STYLE;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const DEFAULT_SPEECH_STYLE = {
  languages: {
    ja: {
      fallback: "新しいメッセージがあります。",
      templates: ["{text}"],
      stripPrefixes: [],
      stripTerms: [],
    },
    en: {
      fallback: "New message.",
      templates: ["{text}"],
      stripPrefixes: ["ok", "okay", "got it"],
      stripTerms: [],
    },
    zh: {
      fallback: "有新的消息。",
      templates: ["{text}"],
      stripPrefixes: [],
      stripTerms: [],
    },
    ko: {
      fallback: "새 메시지가 있습니다.",
      templates: ["{text}"],
      stripPrefixes: [],
      stripTerms: [],
    },
    fallback: {
      fallback: "New message.",
      templates: ["{text}"],
      stripPrefixes: [],
      stripTerms: [],
    },
  },
};

function stableIndex(text, count) {
  let sum = 0;
  for (const char of text) sum = (sum + char.codePointAt(0)) % 9973;
  return count > 0 ? sum % count : 0;
}

function normalizedKey(text) {
  return text.toLowerCase().replace(/\s+/g, "").replace(/[`*_#>\-・、,。，．.。！？!?「」『』[\]()（）:：]/g, "");
}

function speak(text, opts) {
  const engine = resolvedTTSEngine(text, opts);
  if (engine === "kokoro") {
    if (!speakWithKokoro(text, opts)) speakWithFallback(text, opts, "Kokoro");
  } else if (engine === "irodori") {
    if (!speakWithIrodori(text, opts)) speakWithFallback(text, opts, "Irodori");
  } else if (engine === "melotts") {
    console.error("[tts-error] MeloTTS is health-only in this build; use --tts melotts --list-voices for external runtime health checks");
  } else if (engine === "voicebox" || engine === "voicevox") {
    if (!speakWithVoicebox(text, opts)) speakWithFallback(text, opts, "VOICEVOX");
  } else if (engine === "say") {
    if (!speakWithSay(text, opts)) console.error("[tts-error] OS speech failed");
  } else {
    console.log(`[tts-fallback] Unknown TTS engine '${engine}'; using OS speech`);
    if (!speakWithSay(text, opts)) console.error("[tts-error] OS speech failed");
  }
}

function speakWithFallback(text, opts, name) {
  console.log(`[tts-fallback] ${name} failed; using OS speech`);
  if (!speakWithSay(text, opts)) console.error("[tts-error] OS speech fallback failed");
}

function resolvedTTSEngine(text, opts) {
  const configured = opts.ttsEngine.toLowerCase();
  if (configured !== "auto" && !opts.languageRoute) return configured;
  const language = resolvedSpeechLanguage(text, opts);
  if (configured === "auto") return preferredProviderForLanguage(language, opts.userPreferencesState);
  if (language === "ja") return "voicevox";
  if (language === "en") return "kokoro";
  return configured;
}

function routingDiagnostic(sourceText, spokenText, opts) {
  const detected = detectedLanguage(sourceText);
  const effective = resolvedSpeechLanguage(sourceText, opts);
  const chosen = resolvedTTSEngine(sourceText, opts);
  const capability = compactRoutingCapability(chosen, effective);
  return {
    sourceText,
    spokenText,
    detectedLanguage: detected,
    speechLanguageHint: opts.speechLanguage,
    effectiveLanguage: effective,
    ttsEngineConfigured: opts.ttsEngine,
    languageRoute: opts.languageRoute,
    chosenEngine: chosen,
    capability,
    userPreferences: opts.userPreferences,
    fallbackReason: routingFallbackReason(chosen, effective, opts),
    summary: opts.summarizeSpeech ? "enabled" : "disabled",
    sourceCharacters: sourceText.length,
  };
}

function compactRoutingCapability(providerId, language) {
  const { provider, languageSupport } = providerCapabilityForRouting(providerId, language);
  return {
    provider: provider?.id ?? providerId,
    status: provider?.status ?? "unknown",
    language,
    languageSupport,
    defaultRouteEligible: Boolean(provider?.defaultRouteEligible),
    needsExternalRuntime: Boolean(provider?.needsExternalRuntime),
    needsModelDownload: Boolean(provider?.needsModelDownload),
    needsApiKey: Boolean(provider?.needsApiKey),
    publicClaimLevel: provider?.publicClaimLevel ?? "unknown",
  };
}

function routingFallbackReason(chosenEngine, language, opts) {
  if (opts.ttsEngine !== "auto" && !opts.languageRoute) return null;
  if (chosenEngine !== "say") return null;
  if (language === "ko") return "ko uses OS speech fallback; no dedicated provider is configured.";
  if (language === "zh") return "zh uses OS speech fallback; no dedicated provider is configured.";
  if (language === "other") return "other uses OS speech fallback; no dedicated provider is configured.";
  return null;
}

function resolvedSpeechLanguage(text, opts) {
  const hint = opts.speechLanguage.toLowerCase();
  return hint === "auto" ? detectedLanguage(text) : hint;
}

function detectedLanguage(text) {
  let kana = 0;
  let latin = 0;
  let hangul = 0;
  let cjk = 0;
  for (const char of text) {
    const value = char.codePointAt(0);
    if (value >= 0x3040 && value <= 0x30ff) kana += 1;
    else if (value >= 0x4e00 && value <= 0x9fff) cjk += 1;
    else if (value >= 0xac00 && value <= 0xd7af) hangul += 1;
    else if ((value >= 0x41 && value <= 0x5a) || (value >= 0x61 && value <= 0x7a)) latin += 1;
  }
  if (kana > 0) return "ja";
  if (hangul > 0) return "ko";
  if (cjk >= 2) return "zh";
  if (latin >= 4) return "en";
  return "other";
}

function speakWithKokoro(text, opts) {
  const scriptPath = join(scriptDir, "tts-kokoro.mjs");
  return runProcess(process.execPath, [
    scriptPath,
    "--text", text,
    "--voice", opts.kokoroVoice,
    "--dtype", opts.kokoroDtype,
    "--device", opts.kokoroDevice,
    "--play",
  ]);
}

function speakWithIrodori(text, opts) {
  const scriptPath = join(scriptDir, "tts-irodori.mjs");
  return runProcess(process.execPath, [
    scriptPath,
    "--text", text,
    "--url", opts.irodoriURL,
    "--voice", opts.irodoriVoice,
    "--model", opts.irodoriModel,
    "--format", opts.irodoriFormat,
    "--play",
  ]);
}

function speakWithVoicebox(text, opts) {
  const scriptPath = join(scriptDir, "tts-voicebox.mjs");
  const args = [
    scriptPath,
    "--text", text,
    "--url", opts.voiceboxURL,
    "--mode", opts.voiceboxMode,
    "--speaker", opts.voiceboxSpeaker,
    "--play",
  ];
  if (opts.voiceboxProfile) args.push("--profile-id", opts.voiceboxProfile);
  if (opts.voiceboxLanguage) args.push("--language", opts.voiceboxLanguage);
  return runProcess(process.execPath, args);
}

function speakWithSay(text, opts) {
  if (process.platform === "darwin") {
    return runProcess("/usr/bin/say", ["-v", opts.voice, "-r", String(opts.rate), text], { label: "macOS say" });
  }
  if (process.platform === "win32") {
    const command = windowsPowerShellCommand();
    if (!command) {
      console.error("[tts-fallback] PowerShell was not found; OS speech is unavailable");
      return false;
    }
    const escaped = text.replaceAll("'", "''");
    const script = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = 0; $s.Speak('${escaped}')`;
    return runProcess(command, ["-NoProfile", "-Command", script], { label: "Windows System.Speech" });
  }
  return runProcess("espeak", [text], { label: "Linux espeak" });
}

function listVoices(opts) {
  if (opts.ttsEngine === "kokoro") {
    runAndPrint(process.execPath, [join(scriptDir, "tts-kokoro.mjs"), "--list-voices", "--dtype", opts.kokoroDtype, "--device", opts.kokoroDevice]);
  } else if (opts.ttsEngine === "irodori") {
    runAndPrint(process.execPath, [join(scriptDir, "tts-irodori.mjs"), "--health", "--url", opts.irodoriURL]);
  } else if (opts.ttsEngine === "melotts") {
    const args = [join(scriptDir, "tts-melotts.mjs"), "--health"];
    if (opts.melottsURL) args.push("--url", opts.melottsURL);
    if (opts.melottsCommand) args.push("--command", opts.melottsCommand);
    if (opts.melottsHealthArg) args.push("--health-arg", opts.melottsHealthArg);
    if (opts.melottsTimeoutMs) args.push("--timeout-ms", String(opts.melottsTimeoutMs));
    if (opts.profileLatency) args.push("--profile-latency");
    runAndPrint(process.execPath, args);
  } else if (opts.ttsEngine === "voicebox" || opts.ttsEngine === "voicevox") {
    runAndPrint(process.execPath, [join(scriptDir, "tts-voicebox.mjs"), "--list-voices", "--mode", opts.voiceboxMode, "--url", opts.voiceboxURL]);
  } else if (process.platform === "darwin") {
    runAndPrint("/usr/bin/say", ["-v", "?"]);
  } else {
    console.log("OS voice listing is not implemented for this platform.");
  }
}

function printProviderCapabilities() {
  console.log(JSON.stringify({ providers: providerCapabilitySummary() }, null, 2));
}

function runProcess(command, args, opts = {}) {
  const result = spawnSync(command, args, { stdio: opts.stdio ?? "ignore" });
  if (result.status === 0) return true;
  console.error(processFailureMessage(command, result, opts.label));
  return false;
}

function processFailureMessage(command, result, label = command) {
  const prefix = `[tts-error] ${label} failed`;
  if (result.error?.code) return `${prefix}: ${result.error.code} (${command})`;
  if (result.signal) return `${prefix}: signal ${result.signal} (${command})`;
  if (result.status != null) return `${prefix}: exit ${result.status} (${command})`;
  return `${prefix}: unknown error (${command})`;
}

function runAndPrint(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  process.exit(result.status ?? 1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function startLatencyProfile(enabled) {
  if (!enabled) return null;
  return {
    startedAt: performance.now(),
    steps: [],
  };
}

function measureLatency(profile, name, operation) {
  if (!profile) return operation();

  const startedAt = performance.now();
  const record = () => {
    profile.steps.push({ name, ms: performance.now() - startedAt });
  };

  try {
    const result = operation();
    if (result && typeof result.finally === "function") {
      return result.finally(record);
    }
    record();
    return result;
  } catch (error) {
    record();
    throw error;
  }
}

function printLatencyProfile(profile, fields) {
  if (!profile) return;
  const totalMs = performance.now() - profile.startedAt;
  const steps = profile.steps.map(step => `${step.name}=${formatLatencyMs(step.ms)}`).join(" ");
  const metadata = Object.entries(fields).map(([key, value]) => `${key}=${value}`).join(" ");
  console.error(`[latency] total=${formatLatencyMs(totalMs)} ${steps} ${metadata}`.trim());
}

function formatLatencyMs(ms) {
  return `${ms.toFixed(1)}ms`;
}

export {
  main,
  parseOptions,
  readLatestSpeechCandidate,
  speechCandidate,
  textForSource,
  speechText,
  cuteSpeechSummary,
  proseForSummary,
  summarySegment,
  detectedLanguage,
  resolvedTTSEngine,
  routingDiagnostic,
  compactRoutingCapability,
  normalizedKey,
  processFailureMessage,
  displayPrivatePath,
  redactPrivatePaths,
};
