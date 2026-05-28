(function () {
  "use strict";

  const DEFAULT_OPTIONS = {
    selectors: [
      "[data-avatar-overlay-measure='notification-tray-row']",
      "[data-avatar-overlay-size='notification-tray-list']",
      "[data-avatar-overlay-size='notification-tray']",
      "[data-pet-bubble]",
      "[data-testid='pet-bubble']",
      "[data-testid='avatar-overlay-notification-badge']",
      "[data-testid*='pet'][data-testid*='bubble']",
      "[data-testid*='pet'][data-testid*='message']",
      ".pet-bubble",
      ".petOverlay",
      "[aria-live='polite']",
      "[role='status']",
    ],
    minLength: 2,
    maxLength: 160,
    debounceMs: 200,
    cooldownMs: 700,
    debug: false,
  };

  let options = { ...DEFAULT_OPTIONS };
  let observer = null;
  let timer = null;
  let lastText = "";
  let lastSpokenAt = 0;
  let selectedElement = null;

  function emit(detail) {
    window.dispatchEvent(new CustomEvent("codex-pet-voice-bridge:status", { detail }));
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isVisible(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function isInteractive(element) {
    return Boolean(element.closest("button, select, input, textarea, option, script, style"));
  }

  function directTextLength(element) {
    return Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => normalizeText(node.textContent))
      .join("")
      .length;
  }

  function scoreElement(element) {
    if (!isVisible(element) || isInteractive(element)) return -1;

    const text = normalizeText(element.textContent);
    if (text.length < options.minLength || text.length > options.maxLength) return -1;

    const idClass = `${element.id || ""} ${element.className || ""} ${element.getAttribute("data-testid") || ""}`.toLowerCase();
    let score = 0;

    if (/pet|mascot|avatar/.test(idClass)) score += 40;
    if (/bubble|speech|message|utterance|overlay/.test(idClass)) score += 40;
    if (element.matches("[aria-live], [role='status']")) score += 20;
    if (directTextLength(element) > 0) score += 10;
    if (/[\u3040-\u30ff\u3400-\u9fff]/u.test(text)) score += 8;
    if (element.children.length <= 2) score += 5;

    const rect = element.getBoundingClientRect();
    if (rect.width <= 420 && rect.height <= 180) score += 8;

    return score;
  }

  function findCandidates() {
    const set = new Set();

    for (const selector of options.selectors) {
      try {
        document.querySelectorAll(selector).forEach((element) => set.add(element));
      } catch {
        // Ignore invalid user-provided selectors.
      }
    }

    if (set.size === 0) {
      document.querySelectorAll("body *").forEach((element) => {
        const score = scoreElement(element);
        if (score >= 50) set.add(element);
      });
    }

    return Array.from(set)
      .map((element) => ({ element, score: scoreElement(element) }))
      .filter((candidate) => candidate.score >= 0)
      .sort((a, b) => b.score - a.score);
  }

  function pickBubbleElement() {
    if (selectedElement && document.contains(selectedElement) && isVisible(selectedElement)) {
      return selectedElement;
    }

    const [best] = findCandidates();
    selectedElement = best?.element || null;
    return selectedElement;
  }

  function getSpeechText(displayText) {
    if (typeof options.toSpeechText === "function") {
      return options.toSpeechText(displayText);
    }
    if (window.TalkingPetMVP?.toSpokenText) {
      return window.TalkingPetMVP.toSpokenText(displayText);
    }
    return displayText;
  }

  function speakCurrentBubble() {
    const element = pickBubbleElement();
    if (!element) {
      emit({ status: "bubble-not-found" });
      return false;
    }

    const displayText = normalizeText(element.textContent);
    if (!displayText || displayText === lastText) return false;

    const now = Date.now();
    if (now - lastSpokenAt < options.cooldownMs) return false;

    lastText = displayText;
    lastSpokenAt = now;

    const speechText = getSpeechText(displayText);
    const ok = window.TalkingPetMVP?.speak
      ? window.TalkingPetMVP.speak({ displayText, speechText })
      : false;

    emit({
      status: ok ? "spoken" : "speak-failed",
      displayText,
      speechText,
      selector: describeElement(element),
    });

    return ok;
  }

  function scheduleSpeak() {
    window.clearTimeout(timer);
    timer = window.setTimeout(speakCurrentBubble, options.debounceMs);
  }

  function describeElement(element) {
    if (!element) return "";
    if (element.id) return `#${element.id}`;
    const testId = element.getAttribute("data-testid");
    if (testId) return `[data-testid="${testId}"]`;
    if (typeof element.className === "string" && element.className.trim()) {
      return `${element.tagName.toLowerCase()}.${element.className.trim().split(/\s+/).join(".")}`;
    }
    return element.tagName.toLowerCase();
  }

  function start(userOptions = {}) {
    stop();
    options = {
      ...DEFAULT_OPTIONS,
      ...userOptions,
      selectors: userOptions.selectors || DEFAULT_OPTIONS.selectors,
    };

    if (!window.TalkingPetMVP) {
      emit({ status: "talking-pet-mvp-missing" });
      return false;
    }

    observer = new MutationObserver(scheduleSpeak);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    scheduleSpeak();
    emit({ status: "watching" });
    return true;
  }

  function stop() {
    if (observer) observer.disconnect();
    observer = null;
    window.clearTimeout(timer);
    timer = null;
    selectedElement = null;
  }

  function setSelector(selector) {
    selectedElement = null;
    options.selectors = [selector];
    scheduleSpeak();
  }

  window.CodexPetVoiceBridge = {
    start,
    stop,
    speakCurrentBubble,
    setSelector,
    findCandidates,
  };
})();
