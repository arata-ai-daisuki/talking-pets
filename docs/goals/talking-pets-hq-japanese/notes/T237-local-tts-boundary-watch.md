# T237 Local TTS Boundary Watch

## Objective

T236のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

## Scope

- VOICEVOX / Irodori evidence-firstの現状を再確認する。
- sherpa / MeloTTS / API TTSは、Masterの明示承認なしに実装・依存追加・model download・API callへ進めない。
- README support claimや性能保証claimを強めない。

## Stop Lines

- `sherpa-onnx-node`をinstallしない。
- MeloTTSのPython/Docker/model/unidic setupをしない。
- model download、API call、生成音声をしない。
- README support claim、latency保証claim、platform support claimを強めない。

## Receipt

- decision: `local_tts_boundary_watch`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: active
- next: recheck local TTS boundary without installs, model downloads, API calls, generated audio, or support-claim changes.
