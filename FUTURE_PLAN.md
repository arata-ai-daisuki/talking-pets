# Future Plan

Talking Pets の将来対応を貯める場所です。README の Roadmap は短い公開向け要約にし、具体的な検討メモや未確定案はここへ集めます。

## Multilingual TTS

### Current State

- Japanese and English are the priority paths.
- Japanese routes to VOICEVOX when available.
- English routes to Kokoro.js when available.
- Other languages currently fall back to OS speech.
- Browser demos now include Japanese / English sample text, but Korean and Chinese are not first-class TTS paths yet.

### Korean

- Add explicit `ko` language detection and routing.
- Decide whether Korean should use OS speech fallback first or a dedicated local TTS provider.
- Add Korean examples to fixtures, demos, and README once a reliable local path exists.
- Confirm behavior on macOS, Windows, and Linux separately because OS voices differ.

### Chinese

- Split Chinese from Japanese in language detection. Current CJK-heavy text can be misclassified as Japanese.
- Add explicit `zh` support in `--speech-language`.
- Decide whether Chinese should use OS speech fallback first or a dedicated local TTS provider.
- Add Simplified / Traditional Chinese examples if the provider choice supports both.

### Open Questions

- Which local Korean / Chinese TTS providers are lightweight, offline-friendly, and redistribution-safe?
- Should `auto` route unsupported languages to OS speech or warn before speaking?
- Should voice presets include per-platform OS voice names for Korean and Chinese?

## Demo Polish

- Replace generated preview PNG with a real browser screenshot or short GIF.
- Add language switching to both browser demos without implying full Korean / Chinese support.
- Keep demo copy neutral and avoid hard-coded character terms or user-specific honorifics.
- The old DOM bridge prototype and OCR monitor are kept locally under `local-experimental/` and ignored by git. Reintroduce them only if the rollout monitor stops being the default path or an official DOM hook appears.

## Packaging

- Revisit npm publication after the CLI surface stabilizes.
- Consider a small executable wrapper if users should not call script paths directly.
- Keep generated audio, model files, local config, and Codex logs out of releases.
