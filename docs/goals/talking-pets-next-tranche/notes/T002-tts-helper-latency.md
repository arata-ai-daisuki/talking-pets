# T002 TTS Helper Latency Receipt

## Result

done

## Summary

Extended latency profiling from the Node rollout monitor to TTS helper scripts and added `docs/performance.md`.

## Changes

- `scripts/tts-kokoro.mjs`
  - Added `--profile-latency`.
  - Measures cache preparation, import, model load, stdin read, generation, save, and optional playback.
  - Keeps normal stdout output unchanged.

- `scripts/tts-voicebox.mjs`
  - Added `--profile-latency`.
  - Measures VOICEVOX audio query, synthesis, response read, write, generic endpoint request, and optional playback.
  - Keeps normal stdout output unchanged.

- `docs/performance.md`
  - Documents current commands, measured sections, known gaps, and optimization candidates.

## Verification

- `node --check scripts/tts-kokoro.mjs`
- `node --check scripts/tts-voicebox.mjs`
- `npm run benchmark:dry-run`
- `node scripts/tts-kokoro.mjs --list-voices --profile-latency`
