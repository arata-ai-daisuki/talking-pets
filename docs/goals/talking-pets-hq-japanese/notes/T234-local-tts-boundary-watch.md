# T234 Local TTS Boundary Watch

## Objective

T233のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

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
- status: done
- result: VOICEVOX / Irodori remain evidence-first, Kokoro cold-start measurement remains model-download approval-gated, and sherpa / MeloTTS / API remain design-only or opt-in.
- docs: added Local TTS Boundary Watch Result to `docs/research/tts-provider-comparison.md`.
- not changed: dependency install, `sherpa-onnx-node`, MeloTTS Python/Docker/model/unidic setup, model download, API call, generated audio, README support claim, latency guarantee claim, platform support claim, default routing.
- next: return to multilingual verification boundary without support-claim changes.
