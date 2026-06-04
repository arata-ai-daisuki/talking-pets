# T252 Local TTS Boundary Watch

## Objective

T251のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

## Scope

- VOICEVOX / Irodoriはevidence-firstのまま扱う。
- Kokoroはmodel download approval-gatedのまま扱う。
- sherpa / MeloTTS / API TTSはdesign-onlyまたはexplicit opt-inの境界を維持する。
- 新しい実装ではなく、現在の境界と次の安全な内部作業だけを記録する。

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
- next: recheck local TTS boundaries without install, dependency change, model download, API call, generated audio, support-claim strengthening, or default-routing changes.
