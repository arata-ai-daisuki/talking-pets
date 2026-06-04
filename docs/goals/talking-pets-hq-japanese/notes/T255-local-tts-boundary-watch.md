# T255 Local TTS Boundary Watch

## Objective

T254のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

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
- status: done
- result: Local TTS Boundary Watch Result 8を追加し、VOICEVOX / Irodoriはevidence-first、Kokoroはmodel-download approval-gated、sherpa / MeloTTS / APIはdesign-onlyまたはopt-inの境界を維持した。
- kept: installなし、dependency changeなし、optional dependency changeなし、sherpa-onnx-node installなし、MeloTTS Python/Docker/model/unidic setupなし、model downloadなし、API callなし、生成音声なし、README support claim変更なし、latency保証claim変更なし、platform support claim変更なし、default routing変更なし。
- next: return to multilingual verification boundary watch without dedicated-provider claims, README support claim changes, fallback-to-provider wording changes, generated audio, private logs, private contact storage, model downloads, or API calls.
