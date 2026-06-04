# T261 Local TTS Boundary Watch

## Objective

T260のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

## Scope

- VOICEVOX / Irodoriはevidence-firstの現行境界を維持する。
- Kokoroはmodel-download approval-gatedのまま扱う。
- sherpa / MeloTTS / API TTSはdesign-onlyまたは明示opt-inのまま扱う。

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
- next: recheck provider design boundaries without installing dependencies, downloading models, calling APIs, generating audio, or strengthening public support claims.
