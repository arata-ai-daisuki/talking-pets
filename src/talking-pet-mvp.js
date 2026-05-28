(function () {
  "use strict";

  const STORAGE_KEYS = {
    enabled: "talkingPet.enabled",
    voiceName: "talkingPet.voiceName",
    voiceURI: "talkingPet.voiceURI",
    rate: "talkingPet.rate",
    pitch: "talkingPet.pitch",
  };

  const DEFAULT_OPTIONS = {
    bubbleSelector: "[data-pet-bubble], [data-testid='pet-bubble'], .pet-bubble",
    observeBubble: true,
    panel: true,
    panelMount: "",
    rate: 1.04,
    pitch: 1.18,
    volume: 1,
    speechStyle: null,
  };

  let options = { ...DEFAULT_OPTIONS };
  let lastSpoken = "";
  let lastObservedText = "";
  let selectedVoiceURI = "";
  let selectedVoiceName = "";
  let observer = null;
  let panel = null;

  function storageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Some file:// and embedded browser contexts block localStorage.
    }
  }

  function storageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Some file:// and embedded browser contexts block localStorage.
    }
  }

  function getSpeech() {
    return window.speechSynthesis || null;
  }

  function isSupported() {
    return Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  function emitStatus(detail) {
    window.dispatchEvent(new CustomEvent("talking-pet:speech-status", { detail }));
  }

  function getVoices() {
    const speech = getSpeech();
    return speech ? speech.getVoices() : [];
  }

  function detectSpeechLanguage(text) {
    let japanese = 0;
    let latin = 0;
    let hangul = 0;
    for (const char of String(text || "")) {
      const value = char.codePointAt(0);
      if (value >= 0x3040 && value <= 0x30ff) japanese += 1;
      else if (value >= 0xac00 && value <= 0xd7af) hangul += 1;
      else if ((value >= 0x41 && value <= 0x5a) || (value >= 0x61 && value <= 0x7a)) latin += 1;
    }
    if (japanese > 0) return "ja";
    if (hangul > 0) return "ko";
    if (latin >= 4) return "en";
    return "";
  }

  function scoreVoice(voice, preferredLanguage) {
    const name = `${voice.name} ${voice.lang}`.toLowerCase();
    let score = 0;
    const lang = voice.lang ? voice.lang.toLowerCase() : "";

    if (preferredLanguage && lang.startsWith(preferredLanguage)) score += 140;
    if (preferredLanguage === "en" && name.includes("english")) score += 45;
    if (preferredLanguage === "ja" && (name.includes("japanese") || name.includes("日本"))) score += 45;
    if (preferredLanguage === "ko" && (name.includes("korean") || name.includes("한국"))) score += 45;

    if (lang.startsWith("ja")) score += 30;
    if (name.includes("japanese") || name.includes("日本")) score += 50;
    if (name.includes("kyoko")) score += 35;
    if (name.includes("sayaka")) score += 30;
    if (name.includes("haruka")) score += 25;
    if (name.includes("google")) score += 12;
    if (name.includes("enhanced") || name.includes("premium")) score += 8;
    if (name.includes("otoya")) score -= 20;

    return score;
  }

  function pickDefaultVoice(preferredLanguage = "") {
    const memoryVoice = findVoice(selectedVoiceURI, selectedVoiceName);
    if (memoryVoice) return memoryVoice;

    const savedURI = storageGet(STORAGE_KEYS.voiceURI);
    const savedName = storageGet(STORAGE_KEYS.voiceName);
    const savedVoice = findVoice(savedURI, savedName);
    if (savedVoice) return savedVoice;

    return getVoices()
      .slice()
      .sort((a, b) => scoreVoice(b, preferredLanguage) - scoreVoice(a, preferredLanguage))[0] || null;
  }

  function findVoice(voiceURI, voiceName) {
    const voices = getVoices();
    if (voiceURI) {
      const exactURI = voices.find((voice) => voice.voiceURI === voiceURI);
      if (exactURI) return exactURI;
    }
    if (voiceName) {
      const exactName = voices.find((voice) => voice.name === voiceName);
      if (exactName) return exactName;
    }
    return null;
  }

  function cleanDisplayText(text) {
    return String(text || "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\/Users\/\S+/g, "ファイル")
      .replace(/[*_#>\[\]{}]/g, "")
      .replace(/[✨💦🎉✅❌⚠️🌱🫶]+/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function toSpokenText(displayText) {
    let text = cleanDisplayText(displayText);
    const style = options.speechStyle || {};

    const replacements = [
      [/^結論[:：]\s*/u, ""],
      [/^確認方法[:：]\s*/u, ""],
      [/^手順[:：]\s*/u, ""],
    ];

    for (const [pattern, replacement] of replacements) {
      text = text.replace(pattern, replacement);
    }

    text = text
      .split(/[。！？!?]/u)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2)
      .join("。");

    if (!text) return "";
    text = (style.template || "{text}").replaceAll("{text}", text);
    return text.endsWith("。") ? text : `${text}。`;
  }

  function speakText(text, override) {
    const speech = getSpeech();
    if (!speech || !window.SpeechSynthesisUtterance) {
      emitStatus({ status: "unsupported" });
      return false;
    }
    if (storageGet(STORAGE_KEYS.enabled) === "false") {
      emitStatus({ status: "disabled" });
      return false;
    }

    const spokenText = override || toSpokenText(text);
    if (!spokenText) {
      emitStatus({ status: "empty" });
      return false;
    }
    lastSpoken = spokenText;

    speech.cancel();

    const utterance = new SpeechSynthesisUtterance(spokenText);
    const language = detectSpeechLanguage(spokenText);
    const voice = pickDefaultVoice(language);
    const savedRate = Number(storageGet(STORAGE_KEYS.rate));
    const savedPitch = Number(storageGet(STORAGE_KEYS.pitch));

    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || (language === "en" ? "en-US" : language === "ko" ? "ko-KR" : "ja-JP");
    utterance.rate = Number.isFinite(savedRate) && savedRate > 0 ? savedRate : options.rate;
    utterance.pitch = Number.isFinite(savedPitch) && savedPitch > 0 ? savedPitch : options.pitch;
    utterance.volume = options.volume;
    utterance.onstart = () => emitStatus({ status: "start", text: spokenText, voice: voiceLabel(voice) });
    utterance.onend = () => emitStatus({ status: "end", text: spokenText, voice: voiceLabel(voice) });
    utterance.onerror = (event) => emitStatus({
      status: "error",
      error: event.error || "unknown",
      text: spokenText,
      voice: voiceLabel(voice),
    });

    emitStatus({ status: "queued", text: spokenText, voice: voiceLabel(voice) });
    speech.speak(utterance);
    return true;
  }

  function voiceLabel(voice) {
    return voice ? `${voice.name} (${voice.lang})` : "system default";
  }

  function speakMessage(message) {
    if (!message) return false;
    if (typeof message === "string") return speakText(message);
    return speakText(message.display || message.displayText || "", message.speech || message.speechText || "");
  }

  function readBubbleText() {
    const bubble = document.querySelector(options.bubbleSelector);
    return bubble ? bubble.textContent.trim() : "";
  }

  function attachBubbleObserver(bubble) {
    if (observer) observer.disconnect();

    observer = new MutationObserver(() => {
      const text = readBubbleText();
      if (text && text !== lastObservedText) {
        lastObservedText = text;
        speakText(text);
      }
    });

    observer.observe(bubble, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function observeBubble() {
    const bubble = document.querySelector(options.bubbleSelector);
    if (bubble) {
      lastObservedText = bubble.textContent.trim();
      attachBubbleObserver(bubble);
      return;
    }

    if (observer) observer.disconnect();

    const target = document.body;
    if (!target) return;

    observer = new MutationObserver(() => {
      const bubble = document.querySelector(options.bubbleSelector);
      if (bubble) {
        lastObservedText = bubble.textContent.trim();
        attachBubbleObserver(bubble);
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });
  }

  function makePanel() {
    if (!options.panel || panel || !document.body) return;

    panel = document.createElement("div");
    panel.dataset.talkingPetPanel = "true";
    panel.innerHTML = [
      "<label data-talking-pet-voice-row><span>Voice</span><select data-talking-pet-voice></select></label>",
      "<div data-talking-pet-actions>",
      "<button type=\"button\" data-talking-pet-test>Test voice</button>",
      "<button type=\"button\" data-talking-pet-toggle>Speech On</button>",
      "</div>",
    ].join("");

    const mount = options.panelMount ? document.querySelector(options.panelMount) : null;
    const fixedPanel = !mount;
    Object.assign(panel.style, {
      position: fixedPanel ? "fixed" : "static",
      right: fixedPanel ? "12px" : "",
      top: fixedPanel ? "12px" : "",
      zIndex: "2147483647",
      display: "grid",
      gap: "8px",
      alignItems: "stretch",
      padding: "8px",
      border: "1px solid rgba(0,0,0,.18)",
      borderRadius: "8px",
      background: "rgba(255,255,255,.94)",
      color: "#111",
      font: "12px system-ui, sans-serif",
      boxShadow: "0 8px 20px rgba(0,0,0,.18)",
      maxWidth: fixedPanel ? "calc(100vw - 24px)" : "100%",
    });

    (mount || document.body).appendChild(panel);
    Object.assign(panel.querySelector("[data-talking-pet-voice-row]").style, {
      display: "grid",
      gap: "4px",
      minWidth: "0",
    });
    Object.assign(panel.querySelector("[data-talking-pet-voice]").style, {
      width: "100%",
      minWidth: "0",
      maxWidth: "100%",
    });
    Object.assign(panel.querySelector("[data-talking-pet-actions]").style, {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    });
    refreshPanel();

    panel.querySelector("[data-talking-pet-voice]").addEventListener("change", (event) => {
      if (event.target.value) {
        const voice = getVoices().find((candidate) => candidate.voiceURI === event.target.value);
        selectedVoiceURI = event.target.value;
        selectedVoiceName = voice?.name || "";
        storageSet(STORAGE_KEYS.voiceURI, event.target.value);
        storageSet(STORAGE_KEYS.voiceName, selectedVoiceName);
        emitStatus({ status: "voice-selected", voice: voiceLabel(voice) });
      } else {
        selectedVoiceURI = "";
        selectedVoiceName = "";
        storageRemove(STORAGE_KEYS.voiceURI);
        storageRemove(STORAGE_KEYS.voiceName);
        emitStatus({ status: "voice-selected", voice: "system default" });
      }
      speakMessage({ speechText: options.speechStyle?.voiceSelectedText || "Voice selected." });
    });

    panel.querySelector("[data-talking-pet-test]").addEventListener("click", () => {
      speakMessage({ speechText: options.speechStyle?.testText || "This is a voice test." });
    });

    panel.querySelector("[data-talking-pet-toggle]").addEventListener("click", () => {
      const next = storageGet(STORAGE_KEYS.enabled) === "false";
      storageSet(STORAGE_KEYS.enabled, String(next));
      refreshPanel();
      if (next) speakMessage({ speechText: options.speechStyle?.enabledText || "Speech enabled." });
    });
  }

  function refreshPanel() {
    if (!panel) return;

    const select = panel.querySelector("[data-talking-pet-voice]");
    const toggle = panel.querySelector("[data-talking-pet-toggle]");
    const voices = getVoices()
      .slice()
      .sort((a, b) => scoreVoice(b) - scoreVoice(a) || a.name.localeCompare(b.name));
    const selectedVoice = pickDefaultVoice();

    select.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = voices.length > 0 ? "System Default" : "System Default (no voices listed yet)";
    defaultOption.selected = !selectedVoice;
    select.appendChild(defaultOption);

    for (const voice of voices) {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.textContent = voiceLabel(voice);
      option.selected = selectedVoice?.voiceURI === voice.voiceURI;
      select.appendChild(option);
    }

    toggle.textContent = storageGet(STORAGE_KEYS.enabled) === "false" ? "Speech Off" : "Speech On";
  }

  function init(userOptions = {}) {
    options = { ...DEFAULT_OPTIONS, ...userOptions };
    if (storageGet(STORAGE_KEYS.enabled) == null) {
      storageSet(STORAGE_KEYS.enabled, "true");
    }
    selectedVoiceURI = storageGet(STORAGE_KEYS.voiceURI) || "";
    selectedVoiceName = storageGet(STORAGE_KEYS.voiceName) || "";

    if (options.observeBubble) observeBubble();
    makePanel();

    const speech = getSpeech();
    if (speech) speech.onvoiceschanged = refreshPanel;

    window.addEventListener("codex-pet:message", (event) => {
      speakMessage(event.detail);
    });

    return window.TalkingPetMVP;
  }

  window.TalkingPetMVP = {
    init,
    speak: speakMessage,
    toSpokenText,
    isSupported,
    getVoices,
    getSelectedVoice: pickDefaultVoice,
    refreshPanel,
  };
})();
