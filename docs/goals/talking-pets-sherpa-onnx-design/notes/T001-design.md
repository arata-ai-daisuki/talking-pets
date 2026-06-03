# T001 Sherpa ONNX Design Receipt

Owner role: 歌澄 音羽

## Result

Done.

Design note created:

- `docs/research/sherpa-onnx-design.md`

## Decision

First package to evaluate should be `sherpa-onnx-node`, not `sherpa-onnx`, because the official JavaScript API docs point to `sherpa-onnx-node` and the official TTS examples use it.

## Guardrails

- No dependency installed.
- No model downloaded.
- No API call.
- No secret used.
- No support claim added.

## Next Implementation Gate

Master approval is needed before adding an optional dependency or downloading any model.
