# T004 Multilingual Routing Scout Receipt

Owner role: 言守 詞葉

## Result

Done.

Current multilingual claims match implementation as long as Korean and Chinese remain described as OS speech fallback paths, not dedicated TTS support.

## Claims To Keep

- Japanese and English are priority paths.
- Japanese routes to VOICEVOX when language routing is enabled/auto.
- English routes to Kokoro.js when language routing is enabled/auto.
- Korean and Chinese are detected and routed as first-class fallback paths.
- `ko` / `zh` style entries are formatting/fallback phrase support, not proof of dedicated TTS quality.

## Claims To Avoid

- Do not claim dedicated Korean TTS support.
- Do not claim dedicated Chinese TTS support.
- Do not claim Chinese sample text is preserved end-to-end without checking summarization behavior.

## Small Contradictions / Clarifications

- README preset excerpts list only `ja` / `en` / `fallback`, while `presets/voices.json` now includes `ko` / `zh` fallback entries. This is not functionally wrong, but can confuse readers.
- `FUTURE_PLAN.md` should distinguish fallback fixtures from reliable dedicated provider support.
- The Chinese fixture dry-run dropped a very short first sentence due to the first-useful-sentence threshold. That behavior should be documented or tested before stronger claims.

## Recommended Next Worker Slice

Add local routing diagnostics for sample text:

- detected language
- manual speech-language override
- chosen engine
- fallback reason
- source length / summary decision

This should not call external services and should not play audio.

## Fixture Gaps

- pure Japanese rollout
- pure English rollout
- Korean short and long samples
- Simplified Chinese
- Traditional Chinese
- CJK-only ambiguous samples
- mixed zh-en
- symbol-only
- manual `--speech-language ko|zh` override cases
