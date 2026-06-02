# Sherpa ONNX Local TTS Design

Last updated: 2026-06-02

This is a design-only note. No dependency was installed and no model was downloaded.

## Decision

Use `sherpa-onnx-node` as the first package to evaluate, not `sherpa-onnx`.

Why:

- The official JavaScript API install page points to `sherpa-onnx-node`.
- Official docs say it supports Linux x64, Linux arm64, macOS x64, macOS arm64, and Windows x64.
- Official docs say it does not require pre-installing a C/C++ compiler, Python, or CMake.
- The official TTS JavaScript example uses `require("sherpa-onnx-node")`.

## Important Integration Notes

### Runtime library path

macOS and Linux require a library path before running scripts:

- macOS: `DYLD_LIBRARY_PATH=$(npm root)/sherpa-onnx-node/lib:$DYLD_LIBRARY_PATH`
- Linux: `LD_LIBRARY_PATH=$(npm root)/sherpa-onnx-node/lib:$LD_LIBRARY_PATH`

Windows should find DLLs inside `node_modules` according to the official docs.

### Model files

Sherpa ONNX TTS is not just one npm package. The Matcha English example needs:

- an acoustic model
- a vocoder model
- tokens
- espeak-ng data

The example downloads model archives from GitHub releases. Talking Pets should not bundle these files in the repo by default.

### Command shape

Recommended experimental helper shape:

```bash
node scripts/tts-sherpa-onnx.mjs \
  --text "Benchmark ready." \
  --model-dir ~/.cache/talking-pets/sherpa/matcha-icefall-en_US-ljspeech \
  --vocoder ~/.cache/talking-pets/sherpa/vocos-22khz-univ.onnx \
  --out /tmp/talking-pets-sherpa.wav \
  --profile-latency
```

The helper should write WAV first. Playback can reuse the existing platform player pattern after generation works.

## Cache Policy

Use a separate cache root:

```text
~/.cache/talking-pets/sherpa/
```

Do not download models automatically on first normal monitor run. A future install/check command can offer an explicit download step after Master approval.

## License Checklist

Before implementation:

- Confirm `sherpa-onnx-node` package license.
- Confirm each model license.
- Confirm vocoder license.
- Confirm whether generated public audio needs attribution.
- Confirm whether any model has language, speaker, or commercial-use limits.
- Add notices to `CREDITS.md` only after the exact model/vocoder choice is made.

## Benchmark Plan

Use the same pattern as existing helpers:

- `prepare_env`
- `import_sherpa`
- `load_model`
- `generate`
- `write_wav`
- `play`

Compare:

- cold start
- warm process if possible later
- generated audio duration
- real-time factor if the API exposes enough data

Do not compare against Kokoro/VOICEVOX claims until the same text and output path are measured.

## Stop Conditions

- Stop if installation requires broad native toolchain setup.
- Stop if model/vocoder license is unclear.
- Stop if model download size is too large for a normal optional install.
- Stop if generated audio quality is not useful for Talking Pets.
- Stop if adding the helper requires a broad provider abstraction first.

## Next Implementation Decision

Recommended next step:

Create `scripts/tts-sherpa-onnx.mjs` only after Master approves an optional local dependency/model experiment.

The first implementation should be experimental and not default:

- no auto route to sherpa
- no auto model download
- no README support claim beyond "experimental local provider"

## Sources

- Official JavaScript API install page: https://k2-fsa.github.io/sherpa/onnx/javascript-api/install.html
- Official Matcha English TTS example: https://k2-fsa.github.io/sherpa/onnx/javascript-api/examples/tts_matcha_en.html
- npm package listing for `sherpa-onnx`: https://www.npmjs.com/package/sherpa-onnx
