#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const scriptPath = fileURLToPath(import.meta.url);
let failures = 0;
const allowedEnvKeys = new Set([
  "TALKING_PETS_UI_LANGUAGE",
  "TALKING_PETS_TTS",
  "TALKING_PETS_VOICEVOX_URL",
  "TALKING_PETS_VOICEVOX_SPEAKER",
  "TALKING_PETS_VOICEBOX_MODE",
  "TALKING_PETS_VOICEBOX_PROFILE",
  "TALKING_PETS_VOICEBOX_LANGUAGE",
  "TALKING_PETS_KOKORO_VOICE",
  "TALKING_PETS_IRODORI_URL",
  "TALKING_PETS_IRODORI_VOICE",
  "TALKING_PETS_SAY_VOICE",
  "TALKING_PETS_LANGUAGE_ROUTE",
  "TALKING_PETS_SPEECH_LANGUAGE",
]);

function main() {
  failures = 0;
  checkSpeechStyle();
  checkVoicePresets();
  checkEnvFile(".talking-pets.local.env.example", { expectedUILanguage: "en" });
  checkEnvFile(".talking-pets.local.env", { optional: true, allowMissingUILanguage: true, allowMissingSpeechLanguage: true });
  checkEnvFile("presets/examples/ja-voicevox-zundamon.env", { expectedTTS: "voicevox", expectedRoute: "0", expectedUILanguage: "ja" });
  checkEnvFile("presets/examples/en-kokoro-heart.env", { expectedTTS: "kokoro", expectedRoute: "0", expectedUILanguage: "en" });
  checkEnvFile("presets/examples/privacy-first-say.env", { expectedTTS: "say", expectedRoute: "0", expectedUILanguage: "en" });
  checkEnvFile("presets/examples/ko-say-fallback.env", { expectedTTS: "say", expectedRoute: "0", expectedUILanguage: "en", expectedSpeechLanguage: "ko" });
  checkEnvFile("presets/examples/zh-say-fallback.env", { expectedTTS: "say", expectedRoute: "0", expectedUILanguage: "en", expectedSpeechLanguage: "zh" });
  checkEnvFile("presets/examples/generic-voicebox.env", {
    expectedTTS: "voicebox",
    expectedRoute: "0",
    expectedUILanguage: "en",
    expectedVoiceboxMode: "generic",
    expectedVoiceboxProfile: "default",
    expectedVoiceboxLanguage: "en",
    expectedSpeechLanguage: "en",
  });
  checkLauncherConfigKeys();

  if (failures > 0) {
    console.error(`config files: failed (${failures} issue${failures === 1 ? "" : "s"})`);
    process.exit(1);
  }

  console.log("config files: ok");
}

if (process.argv[1] === scriptPath) {
  main();
}

function checkLauncherConfigKeys() {
  const launchers = [
    "install.command",
    "install.sh",
    "install.ps1",
    "check.command",
    "start-selected-tts.command",
    "check.sh",
    "start-selected-tts.sh",
    "check.ps1",
    "start-selected-tts.ps1",
  ];
  for (const file of launchers) {
    const content = readText(file);
    if (!content) continue;
    for (const key of allowedEnvKeys) {
      if (!content.includes(key)) fail(`${file} does not recognize ${key}`);
    }
  }
}

function checkSpeechStyle() {
  const config = readJSON("presets/speech-style.json");
  if (!config) return;
  const languages = config.languages;
  if (!isObject(languages)) {
    fail("presets/speech-style.json languages must be an object");
    return;
  }
  for (const language of ["ja", "en", "ko", "zh", "fallback"]) {
    const entry = languages[language];
    if (!isObject(entry)) {
      fail(`presets/speech-style.json languages.${language} is required`);
      continue;
    }
    if (typeof entry.fallback !== "string" || entry.fallback.trim() === "") {
      fail(`presets/speech-style.json languages.${language}.fallback must be a non-empty string`);
    }
    if (!Array.isArray(entry.templates) || entry.templates.length === 0) {
      fail(`presets/speech-style.json languages.${language}.templates must be a non-empty array`);
    } else if (!entry.templates.every(template => typeof template === "string" && template.includes("{text}"))) {
      fail(`presets/speech-style.json languages.${language}.templates must contain {text}`);
    }
    if (!Array.isArray(entry.stripPrefixes)) {
      fail(`presets/speech-style.json languages.${language}.stripPrefixes must be an array`);
    }
    if (!Array.isArray(entry.stripTerms)) {
      fail(`presets/speech-style.json languages.${language}.stripTerms must be an array`);
    }
  }
}

function checkVoicePresets() {
  const config = readJSON("presets/voices.json");
  if (!config) return;
  if (!isObject(config.default)) {
    fail("presets/voices.json default must be an object");
  } else {
    if (config.default.engine !== "auto") fail("presets/voices.json default.engine must be auto");
    if (config.default.languageRoute !== true) fail("presets/voices.json default.languageRoute must be true");
  }

  const languages = config.languages;
  if (!isObject(languages)) {
    fail("presets/voices.json languages must be an object");
    return;
  }

  const expected = {
    ja: "voicevox",
    en: "kokoro",
    ko: "say",
    zh: "say",
    fallback: "say",
  };
  for (const [language, engine] of Object.entries(expected)) {
    const entry = languages[language];
    if (!isObject(entry)) {
      fail(`presets/voices.json languages.${language} is required`);
      continue;
    }
    if (entry.engine !== engine) fail(`presets/voices.json languages.${language}.engine must be ${engine}`);
    if (typeof entry.label !== "string" || entry.label.trim() === "") {
      fail(`presets/voices.json languages.${language}.label must be a non-empty string`);
    }
  }
}

function validateEnvText(text, file = "env") {
  const values = {};
  const errors = [];
  const lines = text.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const normalizedLine = index === 0 ? line.replace(/^\uFEFF/, "") : line;
    if (!normalizedLine.trim()) continue;
    const match = /^([A-Z0-9_]+)="([^"]*)"$/.exec(normalizedLine);
    if (!match) {
      errors.push(`${file}:${index + 1} must use KEY="value" format`);
      continue;
    }
    if (!allowedEnvKeys.has(match[1])) {
      errors.push(`${file}:${index + 1} has unsupported key: ${match[1]}`);
      continue;
    }
    values[match[1]] = match[2];
  }
  return { values, errors };
}

function checkEnvFile(file, opts = {}) {
  const path = join(root, file);
  if (!existsSync(path)) {
    if (opts.optional) return;
    fail(`missing env file: ${file}`);
    return;
  }
  const result = validateEnvText(readFileSync(path, "utf8"), file);
  const values = result.values;
  for (const message of result.errors) {
    fail(message);
  }

  const requiredKeys = [
    "TALKING_PETS_TTS",
    "TALKING_PETS_VOICEVOX_URL",
    "TALKING_PETS_VOICEVOX_SPEAKER",
    "TALKING_PETS_KOKORO_VOICE",
    "TALKING_PETS_SAY_VOICE",
    "TALKING_PETS_LANGUAGE_ROUTE",
    "TALKING_PETS_SPEECH_LANGUAGE",
  ];
  if (!opts.allowMissingUILanguage) requiredKeys.push("TALKING_PETS_UI_LANGUAGE");
  if (opts.allowMissingSpeechLanguage) {
    requiredKeys.splice(requiredKeys.indexOf("TALKING_PETS_SPEECH_LANGUAGE"), 1);
  }

  for (const key of requiredKeys) {
    if (!(key in values)) fail(`${file} missing ${key}`);
  }

  for (const message of validateEnvValues(values, file)) {
    fail(message);
  }

  if (opts.expectedTTS && values.TALKING_PETS_TTS !== opts.expectedTTS) {
    fail(`${file} TALKING_PETS_TTS must be ${opts.expectedTTS}`);
  }
  if (opts.expectedRoute && values.TALKING_PETS_LANGUAGE_ROUTE !== opts.expectedRoute) {
    fail(`${file} TALKING_PETS_LANGUAGE_ROUTE must be ${opts.expectedRoute}`);
  }
  if (opts.expectedUILanguage && values.TALKING_PETS_UI_LANGUAGE !== opts.expectedUILanguage) {
    fail(`${file} TALKING_PETS_UI_LANGUAGE must be ${opts.expectedUILanguage}`);
  }
  if (opts.expectedVoiceboxMode && values.TALKING_PETS_VOICEBOX_MODE !== opts.expectedVoiceboxMode) {
    fail(`${file} TALKING_PETS_VOICEBOX_MODE must be ${opts.expectedVoiceboxMode}`);
  }
  if (opts.expectedVoiceboxProfile && values.TALKING_PETS_VOICEBOX_PROFILE !== opts.expectedVoiceboxProfile) {
    fail(`${file} TALKING_PETS_VOICEBOX_PROFILE must be ${opts.expectedVoiceboxProfile}`);
  }
  if (opts.expectedVoiceboxLanguage && values.TALKING_PETS_VOICEBOX_LANGUAGE !== opts.expectedVoiceboxLanguage) {
    fail(`${file} TALKING_PETS_VOICEBOX_LANGUAGE must be ${opts.expectedVoiceboxLanguage}`);
  }
  if (opts.expectedSpeechLanguage && values.TALKING_PETS_SPEECH_LANGUAGE !== opts.expectedSpeechLanguage) {
    fail(`${file} TALKING_PETS_SPEECH_LANGUAGE must be ${opts.expectedSpeechLanguage}`);
  }
}

function validateEnvValues(values, file = "env") {
  const errors = [];
  if (values.TALKING_PETS_TTS && !["auto", "voicevox", "voicebox", "kokoro", "irodori", "say"].includes(values.TALKING_PETS_TTS)) {
    errors.push(`${file} TALKING_PETS_TTS has unsupported value: ${values.TALKING_PETS_TTS}`);
  }
  if (values.TALKING_PETS_VOICEBOX_MODE && !["voicevox", "generic"].includes(values.TALKING_PETS_VOICEBOX_MODE)) {
    errors.push(`${file} TALKING_PETS_VOICEBOX_MODE must be voicevox or generic`);
  }
  if (values.TALKING_PETS_LANGUAGE_ROUTE && !["0", "1"].includes(values.TALKING_PETS_LANGUAGE_ROUTE)) {
    errors.push(`${file} TALKING_PETS_LANGUAGE_ROUTE must be 0 or 1`);
  }
  if (values.TALKING_PETS_SPEECH_LANGUAGE && !["auto", "ja", "en", "ko", "zh", "other"].includes(values.TALKING_PETS_SPEECH_LANGUAGE)) {
    errors.push(`${file} TALKING_PETS_SPEECH_LANGUAGE must be auto, ja, en, ko, zh, or other`);
  }
  if (values.TALKING_PETS_UI_LANGUAGE && !["en", "ja"].includes(values.TALKING_PETS_UI_LANGUAGE)) {
    errors.push(`${file} TALKING_PETS_UI_LANGUAGE must be en or ja`);
  }
  if (values.TALKING_PETS_VOICEVOX_URL && !isHTTPURL(values.TALKING_PETS_VOICEVOX_URL)) {
    errors.push(`${file} TALKING_PETS_VOICEVOX_URL must be a valid http(s) URL`);
  }
  if (values.TALKING_PETS_IRODORI_URL && !isHTTPURL(values.TALKING_PETS_IRODORI_URL)) {
    errors.push(`${file} TALKING_PETS_IRODORI_URL must be a valid http(s) URL`);
  }
  if (values.TALKING_PETS_VOICEVOX_SPEAKER && !/^\d+$/.test(values.TALKING_PETS_VOICEVOX_SPEAKER)) {
    errors.push(`${file} TALKING_PETS_VOICEVOX_SPEAKER must be a numeric speaker/style id`);
  }
  for (const key of ["TALKING_PETS_VOICEBOX_PROFILE", "TALKING_PETS_VOICEBOX_LANGUAGE", "TALKING_PETS_KOKORO_VOICE", "TALKING_PETS_IRODORI_VOICE", "TALKING_PETS_SAY_VOICE"]) {
    if (values[key] != null && values[key].trim() === "") {
      errors.push(`${file} ${key} must not be empty`);
    }
  }
  return errors;
}

function readJSON(file) {
  try {
    return JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    fail(`${file} is not parseable JSON: ${error.message}`);
    return null;
  }
}

function readText(file) {
  try {
    return readFileSync(join(root, file), "utf8");
  } catch (error) {
    fail(`${file} is not readable: ${error.message}`);
    return "";
  }
}

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isHTTPURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function fail(message) {
  failures += 1;
  console.error(`[fail] ${message}`);
}

export { allowedEnvKeys, isHTTPURL, validateEnvText, validateEnvValues, main };
