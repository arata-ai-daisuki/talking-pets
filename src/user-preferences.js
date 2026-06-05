import { readFileSync } from "node:fs";

import { providerCapability, providerLanguageSupport } from "./provider-capabilities.js";

const SPEED_QUALITY_VALUES = new Set(["latency", "balanced", "quality"]);
const LANGUAGE_VALUES = new Set(["auto", "ja", "en", "ko", "zh", "other"]);

const DEFAULT_USER_PREFERENCES = Object.freeze({
  schemaVersion: 1,
  speechLanguage: "auto",
  speedQuality: "balanced",
  apiOptIn: false,
  providerPriority: Object.freeze({
    ja: Object.freeze(["voicevox", "say"]),
    en: Object.freeze(["kokoro", "say"]),
    ko: Object.freeze(["say"]),
    zh: Object.freeze(["say"]),
    other: Object.freeze(["say"]),
  }),
  voices: Object.freeze({
    ja: Object.freeze({ voicevoxSpeaker: "3" }),
    en: Object.freeze({ kokoroVoice: "af_heart" }),
    fallback: Object.freeze({ sayVoice: "Kyoko" }),
  }),
});

function loadUserPreferences(path) {
  if (!path) return { preferences: DEFAULT_USER_PREFERENCES, source: "default", warnings: [] };
  const text = readFileSync(path, "utf8");
  const parsed = JSON.parse(text);
  const normalized = normalizeUserPreferences(parsed);
  return { preferences: normalized.preferences, source: path, warnings: normalized.warnings };
}

function normalizeUserPreferences(input) {
  const warnings = [];
  const result = {
    schemaVersion: 1,
    speechLanguage: DEFAULT_USER_PREFERENCES.speechLanguage,
    speedQuality: DEFAULT_USER_PREFERENCES.speedQuality,
    apiOptIn: false,
    providerPriority: { ...DEFAULT_USER_PREFERENCES.providerPriority },
    voices: { ...DEFAULT_USER_PREFERENCES.voices },
  };

  if (!isObject(input)) {
    throw new Error("preferences must be a JSON object");
  }
  if (input.schemaVersion != null && input.schemaVersion !== 1) {
    throw new Error("preferences.schemaVersion must be 1");
  }
  if (input.speechLanguage != null) {
    result.speechLanguage = choice("preferences.speechLanguage", input.speechLanguage, LANGUAGE_VALUES);
  }
  if (input.speedQuality != null) {
    result.speedQuality = choice("preferences.speedQuality", input.speedQuality, SPEED_QUALITY_VALUES);
  }
  if (input.apiOptIn != null) {
    if (typeof input.apiOptIn !== "boolean") throw new Error("preferences.apiOptIn must be boolean");
    result.apiOptIn = input.apiOptIn;
  }
  if (isObject(input.providerPriority)) {
    result.providerPriority = normalizeProviderPriority(input.providerPriority, warnings);
  }
  if (isObject(input.voices)) {
    result.voices = normalizeVoices(input.voices);
  }

  return { preferences: result, warnings };
}

function normalizeProviderPriority(value, warnings) {
  const result = { ...DEFAULT_USER_PREFERENCES.providerPriority };
  for (const language of ["ja", "en", "ko", "zh", "other"]) {
    if (value[language] == null) continue;
    if (!Array.isArray(value[language]) || value[language].length === 0) {
      throw new Error(`preferences.providerPriority.${language} must be a non-empty array`);
    }
    result[language] = value[language].map((providerId, index) => {
      if (typeof providerId !== "string" || providerId.trim() === "") {
        throw new Error(`preferences.providerPriority.${language}[${index}] must be a provider id`);
      }
      const normalized = providerId.trim();
      if (!providerCapability(normalized)) warnings.push(`unknown provider in ${language} priority: ${normalized}`);
      return normalized;
    });
  }
  return result;
}

function normalizeVoices(value) {
  const result = { ...DEFAULT_USER_PREFERENCES.voices };
  for (const language of ["ja", "en", "ko", "zh", "other", "fallback"]) {
    if (value[language] == null) continue;
    if (!isObject(value[language])) throw new Error(`preferences.voices.${language} must be an object`);
    result[language] = { ...value[language] };
  }
  return result;
}

function applyUserPreferences(options, preferencesState) {
  const preferences = preferencesState?.preferences ?? DEFAULT_USER_PREFERENCES;
  const next = {
    ...options,
    userPreferencesState: preferencesState ?? { preferences: DEFAULT_USER_PREFERENCES, source: "default", warnings: [] },
    userPreferences: preferenceDiagnostic(preferencesState),
  };
  if (options.speechLanguage === "auto" && preferences.speechLanguage !== "auto") {
    next.speechLanguage = preferences.speechLanguage;
  }

  const voice = voicePreferenceFor(next.speechLanguage, preferences);
  if (voice.sayVoice && options.voice === "Kyoko") next.voice = voice.sayVoice;
  if (voice.kokoroVoice && options.kokoroVoice === "af_heart") next.kokoroVoice = voice.kokoroVoice;
  if (voice.voicevoxSpeaker && options.voiceboxSpeaker === "3") next.voiceboxSpeaker = voice.voicevoxSpeaker;
  return next;
}

function preferredProviderForLanguage(language, preferencesState) {
  const preferences = preferencesState?.preferences ?? DEFAULT_USER_PREFERENCES;
  const key = LANGUAGE_VALUES.has(language) && language !== "auto" ? language : "other";
  const priority = preferences.providerPriority[key] ?? preferences.providerPriority.other ?? ["say"];
  for (const providerId of priority) {
    const support = providerLanguageSupport(providerId, key);
    if (["provider-specific", "fallback-only"].includes(support.level)) return providerId;
  }
  return priority[0] ?? "say";
}

function preferenceDiagnostic(preferencesState) {
  const preferences = preferencesState?.preferences ?? DEFAULT_USER_PREFERENCES;
  return {
    source: preferencesState?.source ?? "default",
    speechLanguage: preferences.speechLanguage,
    speedQuality: preferences.speedQuality,
    apiOptIn: preferences.apiOptIn,
    providerPriority: preferences.providerPriority,
    warnings: preferencesState?.warnings ?? [],
  };
}

function voicePreferenceFor(language, preferences) {
  const key = LANGUAGE_VALUES.has(language) && language !== "auto" ? language : "fallback";
  return preferences.voices[key] ?? preferences.voices.fallback ?? {};
}

function choice(label, value, allowed) {
  if (typeof value !== "string" || !allowed.has(value)) {
    throw new Error(`${label} must be one of: ${[...allowed].join(", ")}`);
  }
  return value;
}

function isObject(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

export {
  DEFAULT_USER_PREFERENCES,
  applyUserPreferences,
  loadUserPreferences,
  normalizeUserPreferences,
  preferenceDiagnostic,
  preferredProviderForLanguage,
};
