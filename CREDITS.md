# Credits And Third-Party Notices

Talking Pets connects local Codex conversation logs to local text-to-speech providers.
This repository does not bundle VOICEVOX, VOICEVOX voice libraries, Kokoro model files, Irodori-TTS-Server, Irodori model files, reference voices, or Codex.

## VOICEVOX

- Website: https://voicevox.hiroshiba.jp/
- Software terms: https://voicevox.hiroshiba.jp/term/
- Usage guide: https://voicevox.hiroshiba.jp/how_to_use/

Talking Pets can call a locally running VOICEVOX Engine at `http://127.0.0.1:50021`.
VOICEVOX itself is not included in this repository.

When you publish audio generated with VOICEVOX, follow the VOICEVOX software terms and the terms for the selected voice library.
VOICEVOX commonly requires credit notation that makes VOICEVOX usage clear. For example, when using Zundamon:

```text
VOICEVOX:ずんだもん
```

Always confirm the current official terms before public or commercial use.

## Kokoro / Kokoro.js

- Kokoro.js package: https://www.npmjs.com/package/kokoro-js
- Default ONNX model used by this repository: https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
- Upstream Kokoro model family: https://huggingface.co/hexgrad/Kokoro-82M

Talking Pets uses `kokoro-js` as an optional local English-oriented TTS provider.
Model files are downloaded on first use by the underlying tooling and are not bundled in this repository.

Check the package and model pages for the current license, attribution, and usage requirements before redistributing generated audio or packaged model files.

## Irodori-TTS / Irodori-TTS-Server

- Irodori-TTS repository: https://github.com/Aratako/Irodori-TTS
- Irodori-TTS-Server repository: https://github.com/Aratako/Irodori-TTS-Server
- Default model family: https://huggingface.co/Aratako/Irodori-TTS-500M-v3

Talking Pets can call a locally running Irodori-TTS-Server as an experimental optional provider.
The server, model weights, codec assets, and reference voices are not included in this repository.

Check the current Irodori model cards and server documentation for license, attribution, ethical restrictions, and voice cloning requirements before publishing generated audio.

## Codex

Talking Pets reads local Codex conversation metadata and rollout JSONL files.
It does not modify Codex Desktop, patch a signed application bundle, or include Codex code.

Codex availability and plan limits are controlled by OpenAI and may change.
See the current OpenAI Help Center page linked from the README for plan details.
