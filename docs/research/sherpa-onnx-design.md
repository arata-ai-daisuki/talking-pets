# Sherpa ONNX Local TTS Design

Last updated: 2026-06-02

This is a design-only note. No dependency was installed and no model was downloaded.

## Provider Template Alignment

Use this section with `docs/research/provider-design-note-template.md` before any `sherpa-onnx-node` helper PR.

### Candidate

- Provider: `sherpa-onnx-node`
- Public source: official Sherpa ONNX JavaScript API docs and npm package pages listed in "Sources"
- Intended role: future optional local ONNX TTS provider
- Proposed readiness level: L0 design-only / dependency-and-model-review candidate

### Integration Shape

- User-facing setup path: explicit optional experiment only after Master approval.
- Talking Pets call surface: Node helper script that imports `sherpa-onnx-node`, writes WAV, then optionally uses the existing platform playback path.
- Normal install impact: none until approved; normal `npm ci`, `npm run check:all`, and package checks must pass when Sherpa is absent.
- Failure mode when provider is absent: helper reports unavailable and routing falls back to existing providers.
- First helper PR scope: optional helper only, no default route, no automatic model download, no README support wording beyond experimental candidate if approved.

### Boundaries

| Boundary | Answer |
| --- | --- |
| Dependency | Do not add `sherpa-onnx-node` until Master approves an optional dependency/model experiment. |
| Model download | Do not download acoustic model, vocoder, tokens, or espeak-ng data automatically. Downloads must be explicit, user-approved, and cached outside the repo. |
| Cache location | Use `~/.cache/talking-pets/sherpa/` for any future model assets; never commit generated or downloaded files. |
| License and attribution | Package, acoustic model, vocoder, tokens, espeak-ng data, generated audio, and attribution terms all need exact review before implementation. |
| Privacy and network behavior | Intended synthesis path is local after assets are present. Future download commands must disclose source URLs and avoid normal monitor runs. |
| Supported OS / architecture | Official docs list Linux x64/arm64, macOS x64/arm64, and Windows x64, but Talking Pets evidence is still unverified. |
| Measurement output | Future helper should emit health/import, model load, generate, write, audio duration, RTF when possible, playback flag, and sanitized `[latency]` output. |
| README wording | Keep README wording at "future optional experimental provider" until dependency/model/license review and real-device evidence exist. |

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

Contributor evidence should use a sanitized Platform verification issue. Do not attach generated WAV files unless the exact model and generated-audio terms are reviewed first.

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

## B Design-Only Scope

This is the exact scope for option B in the Local TTS Master Choice Card. It is still design-only.

### Future Experiment Shape

| Area | Proposed shape | Still blocked |
| --- | --- | --- |
| Package | Review `sherpa-onnx-node` as an optional runtime dependency candidate. | Do not add it to `package.json` yet. |
| Model family | Start from one English Matcha-style example only, because it has public JavaScript example docs. | Do not generalize to all Sherpa models or languages. |
| Asset cache | Keep model, vocoder, tokens, and espeak-ng data under `~/.cache/talking-pets/sherpa/`. | Do not place downloaded assets in the repo or npm package. |
| Helper surface | Future helper may accept `--text`, `--model-dir`, `--vocoder`, `--out`, and `--profile-latency`. | Do not change default routing or normal monitor behavior. |
| Measurement | Emit import/load/generate/write/audioDuration/RTF/playbackIncluded fields. | Do not compare against VOICEVOX/Irodori unless text and output path are aligned. |
| License | Review package, acoustic model, vocoder, tokens, espeak-ng data, and generated-audio terms as separate items. | Do not add README support wording before the exact assets are known. |

### Approval Question For Master

Approve B only if the next PR may inspect package metadata and public model docs for one named Sherpa example, without installing dependencies or downloading model assets.

## Sources

- Official JavaScript API install page: https://k2-fsa.github.io/sherpa/onnx/javascript-api/install.html
- Official Matcha English TTS example: https://k2-fsa.github.io/sherpa/onnx/javascript-api/examples/tts_matcha_en.html
- npm package listing for `sherpa-onnx`: https://www.npmjs.com/package/sherpa-onnx
