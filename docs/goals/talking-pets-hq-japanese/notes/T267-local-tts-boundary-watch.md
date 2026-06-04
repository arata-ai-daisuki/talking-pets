# T267 Local TTS Boundary Watch

## Objective

T266のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

## Scope

- VOICEVOX / Irodoriはevidence-firstの既存実装として扱う。
- Kokoroはmodel download approval-gatedの境界を維持する。
- sherpa / MeloTTS / API TTSは、design-onlyまたはopt-inの範囲で扱う。

## Stop Lines

- install、dependency change、optional dependency changeをしない。
- `sherpa-onnx-node`をinstallしない。
- MeloTTSのPython/Docker/model/unidic setupをしない。
- model download、API call、生成音声をしない。
- README support claim、latency保証claim、platform support claim、default routingを強めない。

## Receipt

- decision: `local_tts_boundary_watch`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: active
- next: refresh local TTS boundaries without installs, dependency changes, model downloads, API calls, generated audio, or support-claim changes.
