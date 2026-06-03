# T003 Multilingual Fallback Receipt

## Result

done

## Summary

Aligned Korean and Chinese language handling as first-class fallback paths without claiming dedicated TTS provider support.

## Changes

- Added `zh` to `--speech-language` help.
- Adjusted Node monitor language detection so CJK-only text can route to `zh` instead of always falling into Japanese.
- Added `ko` / `zh` fallback entries to `presets/speech-style.json`.
- Added `ko` / `zh` fallback entries to `presets/voices.json`.
- Updated README / README.en language notes to say Korean and Chinese are OS speech fallback paths for now.
- Updated FUTURE_PLAN to treat `ko` / `zh` as first-class fallback, not dedicated provider support.
- Added `test/fixtures/ko-rollout.jsonl` and `test/fixtures/zh-rollout.jsonl`.

## Verification

- `node --check scripts/pet-rollout-monitor.mjs`
- `npm run test:dry-run`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --speech-language ko --rollout test/fixtures/ko-rollout.jsonl`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --speech-language zh --rollout test/fixtures/zh-rollout.jsonl`
