const LANGUAGE_KEYS = ["ja", "en", "ko", "zh", "other"];

const unknownSupport = reason => ({
  level: "unknown",
  claimBoundary: reason,
});

const providerSpecific = evidence => ({
  level: "provider-specific",
  claimBoundary: evidence,
});

const fallbackOnly = reason => ({
  level: "fallback-only",
  claimBoundary: reason,
});

const PROVIDER_CAPABILITIES = Object.freeze({
  voicevox: Object.freeze({
    id: "voicevox",
    label: "VOICEVOX compatible local endpoint",
    status: "optional",
    local: true,
    defaultRouteEligible: true,
    needsExternalRuntime: true,
    needsModelDownload: false,
    needsApiKey: false,
    publicClaimLevel: "supported-optional-ja",
    languages: Object.freeze({
      ja: providerSpecific("Japanese support is provider-specific when a local VOICEVOX compatible endpoint is running."),
      en: unknownSupport("English is endpoint/profile dependent and is not claimed by the default route."),
      ko: unknownSupport("Korean is not claimed for the default VOICEVOX route."),
      zh: unknownSupport("Chinese is not claimed for the default VOICEVOX route."),
      other: unknownSupport("Other languages are endpoint/profile dependent."),
    }),
  }),
  voicebox: Object.freeze({
    id: "voicebox",
    label: "Voicebox-compatible local endpoint",
    status: "optional",
    local: true,
    defaultRouteEligible: false,
    needsExternalRuntime: true,
    needsModelDownload: false,
    needsApiKey: false,
    publicClaimLevel: "endpoint-defined",
    languages: Object.freeze({
      ja: providerSpecific("Japanese support depends on the connected Voicebox-compatible endpoint and selected profile."),
      en: unknownSupport("English is endpoint/profile dependent."),
      ko: unknownSupport("Korean is endpoint/profile dependent and is not claimed by Talking Pets."),
      zh: unknownSupport("Chinese is endpoint/profile dependent and is not claimed by Talking Pets."),
      other: unknownSupport("Other languages are endpoint/profile dependent."),
    }),
  }),
  kokoro: Object.freeze({
    id: "kokoro",
    label: "Kokoro local TTS",
    status: "optional",
    local: true,
    defaultRouteEligible: true,
    needsExternalRuntime: false,
    needsModelDownload: true,
    needsApiKey: false,
    publicClaimLevel: "supported-optional-en",
    languages: Object.freeze({
      ja: unknownSupport("Japanese is not claimed for the default Kokoro route."),
      en: providerSpecific("English support is provider-specific when Kokoro assets are installed."),
      ko: unknownSupport("Korean is not claimed for the default Kokoro route."),
      zh: unknownSupport("Chinese is not claimed for the default Kokoro route."),
      other: unknownSupport("Other languages require provider-specific evidence before public support claims."),
    }),
  }),
  irodori: Object.freeze({
    id: "irodori",
    label: "Irodori TTS Server",
    status: "optional",
    local: true,
    defaultRouteEligible: false,
    needsExternalRuntime: true,
    needsModelDownload: false,
    needsApiKey: false,
    publicClaimLevel: "experimental-local-ja",
    languages: Object.freeze({
      ja: providerSpecific("Japanese support is experimental and requires a running Irodori TTS Server."),
      en: unknownSupport("English is not claimed for the current Irodori route."),
      ko: unknownSupport("Korean is not claimed for the current Irodori route."),
      zh: unknownSupport("Chinese is not claimed for the current Irodori route."),
      other: unknownSupport("Other languages require provider-specific evidence before public support claims."),
    }),
  }),
  melotts: Object.freeze({
    id: "melotts",
    label: "MeloTTS external runtime",
    status: "external-runtime-health-only",
    local: true,
    defaultRouteEligible: false,
    needsExternalRuntime: true,
    needsModelDownload: true,
    needsApiKey: false,
    publicClaimLevel: "health-check-only",
    languages: Object.freeze({
      ja: unknownSupport("Talking Pets currently health-checks MeloTTS but does not synthesize through it."),
      en: unknownSupport("Talking Pets currently health-checks MeloTTS but does not synthesize through it."),
      ko: unknownSupport("Talking Pets currently health-checks MeloTTS but does not synthesize through it."),
      zh: unknownSupport("Talking Pets currently health-checks MeloTTS but does not synthesize through it."),
      other: unknownSupport("Talking Pets currently health-checks MeloTTS but does not synthesize through it."),
    }),
  }),
  say: Object.freeze({
    id: "say",
    label: "OS speech fallback",
    status: "available-fallback",
    local: true,
    defaultRouteEligible: true,
    needsExternalRuntime: false,
    needsModelDownload: false,
    needsApiKey: false,
    publicClaimLevel: "fallback-only",
    languages: Object.freeze({
      ja: fallbackOnly("OS speech fallback can speak text when no provider-specific route is selected; voice quality depends on the OS."),
      en: fallbackOnly("OS speech fallback can speak text when no provider-specific route is selected; voice quality depends on the OS."),
      ko: fallbackOnly("Korean uses OS speech fallback; no dedicated provider is configured."),
      zh: fallbackOnly("Chinese uses OS speech fallback; no dedicated provider is configured."),
      other: fallbackOnly("Other languages use OS speech fallback; no dedicated provider is configured."),
    }),
  }),
  "sherpa-onnx-node": Object.freeze({
    id: "sherpa-onnx-node",
    label: "sherpa-onnx-node",
    status: "design-only",
    local: true,
    defaultRouteEligible: false,
    needsExternalRuntime: false,
    needsModelDownload: true,
    needsApiKey: false,
    publicClaimLevel: "not-implemented",
    languages: Object.freeze({
      ja: unknownSupport("Design candidate only; no Talking Pets route is implemented yet."),
      en: unknownSupport("Design candidate only; no Talking Pets route is implemented yet."),
      ko: unknownSupport("Design candidate only; no Talking Pets route is implemented yet."),
      zh: unknownSupport("Design candidate only; no Talking Pets route is implemented yet."),
      other: unknownSupport("Design candidate only; no Talking Pets route is implemented yet."),
    }),
  }),
  "openai-compatible-local": Object.freeze({
    id: "openai-compatible-local",
    label: "OpenAI-compatible local speech endpoint",
    status: "approval-gated-design",
    local: true,
    defaultRouteEligible: false,
    needsExternalRuntime: true,
    needsModelDownload: false,
    needsApiKey: false,
    publicClaimLevel: "opt-in-local-design-only",
    languages: Object.freeze({
      ja: unknownSupport("Local OpenAI-compatible speech endpoints require explicit opt-in and endpoint-specific evidence."),
      en: unknownSupport("Local OpenAI-compatible speech endpoints require explicit opt-in and endpoint-specific evidence."),
      ko: unknownSupport("Local OpenAI-compatible speech endpoints require explicit opt-in and endpoint-specific evidence."),
      zh: unknownSupport("Local OpenAI-compatible speech endpoints require explicit opt-in and endpoint-specific evidence."),
      other: unknownSupport("Local OpenAI-compatible speech endpoints require explicit opt-in and endpoint-specific evidence."),
    }),
  }),
  "openai-tts-api": Object.freeze({
    id: "openai-tts-api",
    label: "OpenAI Audio speech API",
    status: "approval-gated-design",
    local: false,
    defaultRouteEligible: false,
    needsExternalRuntime: false,
    needsModelDownload: false,
    needsApiKey: true,
    publicClaimLevel: "opt-in-remote-design-only",
    languages: Object.freeze({
      ja: unknownSupport("OpenAI TTS requires explicit remote API opt-in, API credentials, billing acknowledgement, and provider-specific evidence."),
      en: unknownSupport("OpenAI TTS requires explicit remote API opt-in, API credentials, billing acknowledgement, and provider-specific evidence."),
      ko: unknownSupport("OpenAI TTS requires explicit remote API opt-in, API credentials, billing acknowledgement, and provider-specific evidence."),
      zh: unknownSupport("OpenAI TTS requires explicit remote API opt-in, API credentials, billing acknowledgement, and provider-specific evidence."),
      other: unknownSupport("OpenAI TTS requires explicit remote API opt-in, API credentials, billing acknowledgement, and provider-specific evidence."),
    }),
  }),
  "voice-api": Object.freeze({
    id: "voice-api",
    label: "Generic Voice/API provider",
    status: "approval-gated-design",
    local: false,
    defaultRouteEligible: false,
    needsExternalRuntime: false,
    needsModelDownload: false,
    needsApiKey: true,
    publicClaimLevel: "opt-in-design-only",
    languages: Object.freeze({
      ja: unknownSupport("Remote/API voice providers require explicit opt-in and provider-specific evidence."),
      en: unknownSupport("Remote/API voice providers require explicit opt-in and provider-specific evidence."),
      ko: unknownSupport("Remote/API voice providers require explicit opt-in and provider-specific evidence."),
      zh: unknownSupport("Remote/API voice providers require explicit opt-in and provider-specific evidence."),
      other: unknownSupport("Remote/API voice providers require explicit opt-in and provider-specific evidence."),
    }),
  }),
});

const PROVIDER_ORDER = Object.freeze([
  "voicevox",
  "voicebox",
  "kokoro",
  "irodori",
  "melotts",
  "say",
  "sherpa-onnx-node",
  "openai-compatible-local",
  "openai-tts-api",
  "voice-api",
]);

function providerCapability(providerId) {
  return PROVIDER_CAPABILITIES[providerId] ?? null;
}

function providerCapabilitySummary() {
  return PROVIDER_ORDER.map(id => PROVIDER_CAPABILITIES[id]);
}

function providerLanguageSupport(providerId, language) {
  const capability = providerCapability(providerId);
  if (!capability) {
    return unknownSupport(`Unknown provider: ${providerId}`);
  }
  return capability.languages[LANGUAGE_KEYS.includes(language) ? language : "other"] ?? capability.languages.other;
}

function providerCapabilityForRouting(providerId, language) {
  const capability = providerCapability(providerId);
  const support = providerLanguageSupport(providerId, language);
  return {
    provider: capability,
    languageSupport: support,
  };
}

export {
  LANGUAGE_KEYS,
  PROVIDER_CAPABILITIES,
  PROVIDER_ORDER,
  providerCapability,
  providerCapabilityForRouting,
  providerCapabilitySummary,
  providerLanguageSupport,
};
