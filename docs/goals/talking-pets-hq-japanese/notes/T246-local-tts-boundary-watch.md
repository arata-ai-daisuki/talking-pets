# T246 Local TTS Boundary Watch

## Objective

T245のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

## Scope

- VOICEVOX / Irodori / Kokoro / sherpa / MeloTTS / API TTSの現行境界を再確認する。
- VOICEVOX / Irodoriはevidence-first、Kokoroはmodel-download approval-gated、sherpa / MeloTTS / APIはdesign-onlyまたはopt-inとして扱う。
- Master承認がない限り、実装や依存変更ではなく境界記録に留める。

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
- next: recheck local TTS boundaries without installs, dependency changes, model downloads, API calls, generated audio, or support-claim changes.
