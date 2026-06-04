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
- status: done
- result: `Local TTS Boundary Watch Result 12`
- summary: VOICEVOX / Irodoriはevidence-first、Kokoroはmodel-download approval-gated、sherpa / MeloTTS / API TTSはdesign-onlyまたはopt-inの境界を維持した。
- safety: install、dependency change、optional dependency change、sherpa-onnx-node install、MeloTTS Python/Docker/model/unidic setup、model download、API call、生成音声、README support claim、latency保証claim、platform support claim、default routing変更はしていない。
- next: return to multilingual verification boundary without dedicated-provider claims, generated audio, private logs, private contact, model downloads, or API calls.
