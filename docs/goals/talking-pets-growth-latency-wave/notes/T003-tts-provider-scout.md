# T003 TTS Provider Scout Receipt

Owner role: 歌澄 音羽

## Result

Done.

Next TTS provider direction is researched without running paid APIs or collecting secrets.

## Current Baseline

| Provider | Type | Current role |
| --- | --- | --- |
| VOICEVOX Engine | local HTTP | Japanese baseline route |
| Kokoro.js | local model via npm | English-oriented baseline route |
| macOS say / OS speech | local OS fallback | ko / zh / other fallback |

## Candidate Summary

| Candidate | Type | Recommendation |
| --- | --- | --- |
| sherpa-onnx | local/offline ONNX | Best next local experiment |
| Piper | local/offline model | Secondary candidate; maintenance/license needs care because original repo is archived/moved |
| OpenAI TTS | paid/API | P2 opt-in only after Master approval |
| ElevenLabs | paid/API | P2 opt-in only after Master approval |
| Google Cloud TTS | paid/API | P2 enterprise-style option |
| Azure Speech TTS | paid/API | P2 only if avatar/viseme direction matters |

## Recommendation

Next implementation should be a read-only design spike for a `sherpa-onnx` helper:

- expected command/API shape
- output WAV path
- model cache/download location
- model and voice license checklist
- benchmark plan using the existing `--profile-latency` pattern

Only after that should we consider a thin experimental helper such as `scripts/tts-sherpa-onnx.mjs`, behind `--tts sherpa`, never as default.

## Stop Conditions

- Stop if evaluation needs a paid API call, secret, cloud project, or login.
- Stop if model/license/public audio terms are unclear.
- Stop if the provider would require bundling large model files into the repo.
- Stop if testing would send private Codex logs or assistant text to external services.

## Open Decisions For Master

- Is the next provider experiment local-only `sherpa-onnx`, or should we only write an API opt-in design doc first?
- Should Piper be evaluated despite GPL/maintenance uncertainty?
- Which quality bar matters most: Japanese cute voice, English naturalness, Chinese/Korean coverage, or lowest latency?
