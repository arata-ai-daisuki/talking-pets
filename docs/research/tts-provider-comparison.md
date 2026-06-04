# TTS Provider Comparison

Last updated: 2026-06-04

This is a prep-only comparison for Talking Pets. No package was installed, no model was downloaded, no API key was used, and no paid API call was made for this note.

## Decision For The Next Step

Do not chase a new provider implementation yet.

First, make the measurement shape consistent:

- `health`: endpoint or local helper readiness check
- `cold start`: first model load, first engine startup, or first synthesis after a clean start
- `warm synthesis`: repeated synthesis after the runtime is ready
- `audio duration`: generated speech duration
- `real-time factor`: synthesis time divided by audio duration, when available
- `playback start`: time until audible playback begins, when tested
- `setup friction`: install, engine start, model cache, license, and platform notes

## Current Candidates

| Priority | Provider | Role | Strength | Main Risk | Next Safe Action |
| --- | --- | --- | --- | --- | --- |
| P0 | VOICEVOX / Voicebox-compatible endpoint | Japanese local TTS baseline | Mature local Japanese voice path; already supported through voicebox helper | Requires a running local engine; voice and license notices must stay clear | Done on maintainer macOS with running VOICEVOX: warm synthesis total 1.33s / 1.39s / 2.21s |
| P0 | macOS `say` / OS speech fallback | No-extra-install baseline | Fast setup, useful control sample, no model download | Voice quality and language coverage vary by OS | Done once on maintainer macOS: total 440.1ms, speak 434.9ms |
| P1 | Kokoro.js | English local TTS | Already has helper and profile output; useful for English demo path | First run may download/load a model; warm mode may need process reuse | Blocked for now: no local `~/.cache/talking-pets/transformers` cache found, so measurement may require model download |
| P1 | Irodori-TTS Server | Japanese-oriented local server / OpenAI-compatible API | High-quality local Japanese candidate; now has health and contribution docs | Cold start and warm synthesis were slow on the maintainer M1 test device | Keep as experimental and collect more real-device data before optimizing |
| P2 | sherpa-onnx-node | Future local ONNX provider | Cross-platform package looks promising from design notes | Needs dependency, model, vocoder, tokens, espeak data, and license confirmation | Stay design-only until Master approves dependency/model experiment |
| P2 | API TTS | Optional cloud or remote fallback | Can be fast and high quality on good networks | Privacy, cost, API key management, and local-first positioning | Design opt-in boundary first; do not implement by default |

## Measurement Text

Use short, boring sentences so provider comparisons are less about prompt content and more about runtime behavior.

Japanese:

```text
こんにちは。Talking Petsのウォーム測定です。
```

English:

```text
Hello. This is a warm latency test for Talking Pets.
```

## What To Record

For each provider, record:

- device model
- OS and version
- CPU / GPU / accelerator path
- RAM
- Node.js and npm versions
- provider version or engine version
- exact command
- cold or warm state
- generated audio duration
- `health`, `cold start`, `warm synthesis`, `write`, and `play` timings where available
- whether speech was audible
- sanitized evidence link, if shared publicly

## Stop Lines

Stop and ask before:

- adding a dependency
- downloading a model
- calling an external API
- using an API key
- making a paid API call
- recommending a model or voice with unclear license terms

## Recommended Order

1. Add one playback-included VOICEVOX run if audible timing is needed.
2. Ask Master before Kokoro model download if Kokoro cold/warm measurement is still desired.
3. Wait for Irodori contribution data before claiming it is fast or slow generally.
4. Keep sherpa-onnx-node and API TTS as explicit opt-in design work.

## Maintainer Control Sample

macOS `say` via the Node monitor:

```text
[latency] total=440.1ms resolveThread=0.1ms readLatestSpeechCandidate=1.0ms speechText=1.0ms speak=434.9ms candidate=true dryRun=false thread=true
```

This is not a quality benchmark. It is a no-extra-install response-time control sample.

VOICEVOX via the voicebox helper, speaker 3, with a locally running engine:

```text
list_voices total=76.2ms
warm synthesis totals=1388.6ms, 2206.6ms, 1334.3ms
output audio duration=3.861333s
playback-included total=5693.8ms
playback-included synthesis=1127.8ms
playback-included audio duration=3.210667s
```

This is a running-engine benchmark on one maintainer machine, not a universal VOICEVOX claim.

Kokoro status:

```text
no local ~/.cache/talking-pets/transformers cache found
```

Do not measure Kokoro cold start without explicit approval for model download.
