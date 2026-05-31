# Future Plan

Talking Pets の将来対応を貯める場所です。README の Roadmap は短い公開向け要約にし、具体的な検討メモや未確定案はここへ集めます。

## Multilingual TTS

### Current State

- Japanese and English are the priority paths.
- Japanese routes to VOICEVOX when available.
- English routes to Kokoro.js when available.
- Korean, Chinese, and other languages currently fall back to OS speech.
- Browser demos now include Japanese / English sample text, but Korean and Chinese are not first-class TTS paths yet.

### Korean

- Korean Hangul detection is explicit.
- `ko` is accepted by `--speech-language` and currently routes to OS speech fallback.
- Decide whether Korean should stay on OS speech fallback or use a dedicated local TTS provider.
- Add Korean examples to fixtures, demos, and README once a reliable local path exists.
- Confirm behavior on macOS, Windows, and Linux separately because OS voices differ.

### Chinese

- Chinese is split from Japanese in language detection for Han-only CJK text.
- `zh` is accepted by `--speech-language` and currently routes to OS speech fallback.
- Decide whether Chinese should use OS speech fallback first or a dedicated local TTS provider.
- Add Simplified / Traditional Chinese examples if the provider choice supports both.

### Open Questions

- Which local Korean / Chinese TTS providers are lightweight, offline-friendly, and redistribution-safe?
- Should `auto` route unsupported languages to OS speech or warn before speaking?
- Should voice presets include per-platform OS voice names for Korean and Chinese beyond the current generic OS speech fallback?

## Demo Polish

- `assets/demo-preview.png` now uses the real demo recording still frame. If a short GIF is added later, replace that PNG with the GIF or keep both with clear labels.
- Keep the browser demo language switch focused on supported sample copy without implying full Korean / Chinese support.
- Keep demo copy neutral and avoid hard-coded character terms or user-specific honorifics.
- The old DOM bridge prototype and OCR monitor are kept locally under `local-experimental/` and ignored by git. Reintroduce them only if the rollout monitor stops being the default path or an official DOM hook appears.

## Packaging

- Revisit npm publication after the CLI surface stabilizes.
- Consider a small executable wrapper if users should not call script paths directly.
- Keep generated audio, local recordings, archives, model files, local config, and Codex logs out of releases.

## Compatibility And Release Gates

- Keep `npm run check:compat` focused on Codex local storage assumptions: `state_5.sqlite`, `threads.rollout_path`, and supported rollout JSONL assistant message shapes.
- Add a fixture whenever a new Codex rollout event shape is supported.
- Treat Windows / Linux graduation from experimental as blocked until OS/version, CPU architecture, Node.js and npm versions, install, platform check, dry-run, one audible TTS path, TTS path tested, speech-language value, config source, Codex Desktop / CLI version if known, `audible: yes`, `sanitized: yes`, and a sanitized Platform verification issue link are recorded for each OS.
- Treat CI-only evidence, fixture-only dry-runs, `--no-state` compatibility, and package checks as release gates, not Windows / Linux graduation evidence.
- Use `npm run check:audio` in CI and `npm run check:audio:strict` on real release machines to catch missing local playback tools.
- Before release, run `npm run check:all`; for manual release evidence, also run stateful `npm run check:compat`, `npm run check:audio:strict`, `npm run check:pack`, `npm run check:sanitize`, `npm run check:installers`, and the OS-specific installer/check/dry-run/audible TTS script set such as `./install.command` plus `./check.command` plus `./scripts/pet-rollout-monitor.command --tts say --voice Kyoko --once --rollout test/fixtures/assistant-rollout.jsonl`, `.\install.ps1` plus `.\check.ps1` plus `npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl`, or `./install.sh` plus `./check.sh` plus `npm run monitor:node -- --tts say --once --rollout test/fixtures/assistant-rollout.jsonl`.
- Keep OS-specific evidence in `docs/real-device-verification.md` and current status in `docs/verification-status.md` so Windows / Linux experimental status can be removed only from reviewed proof.
- Keep GitHub Release notes based on `docs/release-notes-template.md` so platform status, privacy notes, and TTS limits are not forgotten.
