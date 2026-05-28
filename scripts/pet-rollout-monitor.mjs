#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const options = parseOptions(process.argv.slice(2));

if (options.listVoices) {
  listVoices(options);
  process.exit(0);
}

let lastThread = null;
let lastSpokenKey = null;
let didSkipExisting = false;

while (true) {
  const thread = await resolveThread(options);
  if (!thread) {
    console.log("[wait] Codex thread not found");
    if (options.once) break;
    await sleep(options.interval * 1000);
    continue;
  }

  if (!lastThread || thread.id !== lastThread.id || thread.rolloutPath !== lastThread.rolloutPath) {
    console.log(`[thread] ${thread.title} / ${thread.id}`);
    console.log(`[rollout] ${thread.rolloutPath}`);
    lastThread = thread;
    lastSpokenKey = null;
    didSkipExisting = false;
  }

  const candidate = readLatestSpeechCandidate(thread.rolloutPath, options.maxSourceCharacters);
  if (candidate) {
    const key = normalizedKey(candidate.text);
    if (options.skipExisting && !didSkipExisting) {
      lastSpokenKey = key;
      didSkipExisting = true;
      console.log(`[skip-existing] ${candidate.source} / ${candidate.timestamp}`);
    } else if (key !== lastSpokenKey) {
      const speech = speechText(candidate.text, options);
      console.log(`[source] ${candidate.text}`);
      console.log(`[pet] ${speech}`);
      lastSpokenKey = key;
      if (!options.dryRun) {
        speak(speech, options);
      }
    }
  } else {
    console.log("[wait] speech candidate not found");
  }

  if (options.once) break;
  await sleep(options.interval * 1000);
}

function parseOptions(argv) {
  const result = {
    interval: 1,
    voice: "Kyoko",
    ttsEngine: "auto",
    kokoroVoice: "af_heart",
    kokoroDtype: "q8",
    kokoroDevice: "cpu",
    voiceboxURL: "http://127.0.0.1:50021",
    voiceboxMode: "voicevox",
    voiceboxSpeaker: "3",
    voiceboxProfile: null,
    voiceboxLanguage: null,
    speechLanguage: "auto",
    languageRoute: false,
    rate: 185,
    dryRun: false,
    listVoices: false,
    once: false,
    summarizeSpeech: true,
    skipExisting: false,
    maxSourceCharacters: 4000,
    stateDB: null,
    rolloutPath: null,
    threadId: null,
    cwd: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const takeValue = () => {
      const value = argv[i + 1];
      if (value == null) throw new Error(`${arg} requires a value`);
      i += 1;
      return value;
    };

    switch (arg) {
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      case "--voice":
        result.voice = takeValue();
        break;
      case "--tts":
        result.ttsEngine = takeValue();
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
      case "--voicebox-url":
        result.voiceboxURL = takeValue();
        break;
      case "--voicebox-mode":
        result.voiceboxMode = takeValue();
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
        result.speechLanguage = takeValue();
        break;
      case "--language-route":
        result.languageRoute = true;
        break;
      case "--no-language-route":
        result.languageRoute = false;
        break;
      case "--rate":
        result.rate = Number(takeValue());
        break;
      case "--interval":
        result.interval = Number(takeValue());
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
        result.maxSourceCharacters = Math.max(1, Number(takeValue()));
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
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return result;
}

function printUsage() {
  console.log(`Usage:
  node scripts/pet-rollout-monitor.mjs [options]

Options match pet-rollout-monitor.swift. This Node monitor is experimental and intended for Windows/Linux portability.`);
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

function readLatestSpeechCandidate(rolloutPath, maxSourceCharacters) {
  let text;
  try {
    text = readFileSync(rolloutPath, "utf8");
  } catch {
    return null;
  }

  const lines = text.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    try {
      const object = JSON.parse(lines[i]);
      const candidate = speechCandidate(object);
      if (candidate && candidate.text.length <= maxSourceCharacters) return candidate;
    } catch {
      continue;
    }
  }
  return null;
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
  return opts.summarizeSpeech ? cuteSpeechSummary(sourceText) : sourceText;
}

function cuteSpeechSummary(text) {
  const prose = proseForSummary(text);
  if (!prose) return "マスター、今の吹き出しはちゃんと見てるよ。";
  const sentence = firstUsefulSentence(prose);
  const limit = prose.length <= 80 ? 72 : 64;
  const core = speechCore(trimmedPhrase(sentence, limit));
  if (!core) return "うん、今の吹き出しは拾えてるよ。";
  return cleanSpeechLine(variedSpeechLine(core, prose));
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

function trimmedPhrase(text, maxCharacters) {
  return text.length <= maxCharacters ? text : `${text.slice(0, maxCharacters).trim()}...`;
}

function speechCore(text) {
  return text
    .replaceAll("マスター", "")
    .replace(/([、,])\s*([。！？!?])/g, "$2")
    .replace(/^[、,。\s]+/g, "")
    .replace(/[、,\s]+$/g, "")
    .replace(/\s*[、,]\s*[、,]\s*/g, "、")
    .replace(/\s+/g, " ")
    .trim();
}

function variedSpeechLine(core, seed) {
  const phrase = core
    .trim()
    .replace(/[、,。！？!?. ]+$/g, "")
    .replace(/^(了解|りょうかい|うん|よし|OK|おっけー)[、,\s]+/g, "")
    .replace(/[、,\s]+$/g, "")
    .trim();
  if (!phrase) return "うん、今の吹き出しは拾えてるよ。";
  const templates = [
    value => `マスター、${value}。`,
    value => `うん、${value}。`,
    value => `よし、${value}。`,
    value => `${value}。`,
    value => `ここは、${value}。`,
  ];
  return templates[stableIndex(seed, templates.length)](phrase);
}

function cleanSpeechLine(text) {
  let result = text
    .replace(/[、,]\s*([。！？!?])/g, "$1")
    .replace(/([。！？!?]){2,}/g, "$1")
    .replace(/あたしも追えてるよ[。！？!?]?/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[、,\s]+|[、,\s]+$/g, "");
  if (!/[。！？!?]$/.test(result)) result += "。";
  return result;
}

function stableIndex(text, count) {
  let sum = 0;
  for (const char of text) sum = (sum + char.codePointAt(0)) % 9973;
  return count > 0 ? sum % count : 0;
}

function normalizedKey(text) {
  return text.toLowerCase().replace(/\s+/g, "").replace(/[`*_#>\-・、。，．.。！？!?「」『』[\]()（）:：]/g, "");
}

function speak(text, opts) {
  const engine = resolvedTTSEngine(text, opts);
  if (engine === "kokoro") {
    if (!speakWithKokoro(text, opts)) speakWithFallback(text, opts, "Kokoro");
  } else if (engine === "voicebox" || engine === "voicevox") {
    if (!speakWithVoicebox(text, opts)) speakWithFallback(text, opts, "VOICEVOX");
  } else if (engine === "say") {
    speakWithSay(text, opts);
  } else {
    console.log(`[tts-fallback] Unknown TTS engine '${engine}'; using OS speech`);
    speakWithSay(text, opts);
  }
}

function speakWithFallback(text, opts, name) {
  console.log(`[tts-fallback] ${name} failed; using OS speech`);
  speakWithSay(text, opts);
}

function resolvedTTSEngine(text, opts) {
  const configured = opts.ttsEngine.toLowerCase();
  if (configured !== "auto" && !opts.languageRoute) return configured;
  const language = resolvedSpeechLanguage(text, opts);
  if (language === "ja") return "voicevox";
  if (language === "en") return "kokoro";
  return configured === "auto" ? "say" : configured;
}

function resolvedSpeechLanguage(text, opts) {
  const hint = opts.speechLanguage.toLowerCase();
  return hint === "auto" ? detectedLanguage(text) : hint;
}

function detectedLanguage(text) {
  let japanese = 0;
  let latin = 0;
  let hangul = 0;
  let cjk = 0;
  for (const char of text) {
    const value = char.codePointAt(0);
    if (value >= 0x3040 && value <= 0x30ff) japanese += 1;
    else if (value >= 0x4e00 && value <= 0x9fff) cjk += 1;
    else if (value >= 0xac00 && value <= 0xd7af) hangul += 1;
    else if ((value >= 0x41 && value <= 0x5a) || (value >= 0x61 && value <= 0x7a)) latin += 1;
  }
  if (japanese > 0 || cjk >= 2) return "ja";
  if (hangul > 0) return "ko";
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
    runProcess("/usr/bin/say", ["-v", opts.voice, "-r", String(opts.rate), text]);
    return;
  }
  if (process.platform === "win32") {
    const escaped = text.replaceAll("'", "''");
    const script = `Add-Type -AssemblyName System.Speech; $s = New-Object System.Speech.Synthesis.SpeechSynthesizer; $s.Rate = 0; $s.Speak('${escaped}')`;
    runProcess("powershell.exe", ["-NoProfile", "-Command", script]);
    return;
  }
  runProcess("espeak", [text]);
}

function listVoices(opts) {
  if (opts.ttsEngine === "kokoro") {
    runAndPrint(process.execPath, [join(scriptDir, "tts-kokoro.mjs"), "--list-voices", "--dtype", opts.kokoroDtype, "--device", opts.kokoroDevice]);
  } else if (opts.ttsEngine === "voicebox" || opts.ttsEngine === "voicevox") {
    runAndPrint(process.execPath, [join(scriptDir, "tts-voicebox.mjs"), "--list-voices", "--mode", opts.voiceboxMode, "--url", opts.voiceboxURL]);
  } else if (process.platform === "darwin") {
    runAndPrint("/usr/bin/say", ["-v", "?"]);
  } else {
    console.log("OS voice listing is not implemented for this platform.");
  }
}

function runProcess(command, args) {
  const result = spawnSync(command, args, { stdio: "ignore" });
  return result.status === 0;
}

function runAndPrint(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  process.exit(result.status ?? 1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
