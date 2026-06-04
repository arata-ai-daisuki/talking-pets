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
- status: done
- result: Local TTS Boundary Watch Result 10
- summary: VOICEVOX / Irodoriはevidence-first、Kokoroはmodel-download approval-gated、sherpa / MeloTTS / APIはdesign-onlyまたはopt-inの境界を維持した。
- safety: install、dependency change、optional dependency change、sherpa-onnx-node install、MeloTTS Python/Docker/model/unidic setup、model download、API call、生成音声、README support claim、latency保証claim、platform support claim、default routing変更はしていない。
- next: return to multilingual verification boundary watch without dedicated-provider claims, generated audio, private logs, private contact, model downloads, or API calls.
