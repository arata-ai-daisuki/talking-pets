# T270 Local TTS Boundary Watch

## Objective

T269のoutreach waiting lane boundary watch後に、local TTS設計の境界へ戻る。

## Scope

- VOICEVOX / Irodoriはevidence-firstのまま扱う。
- Kokoroはhelperがあるが、cold-start/cache measurementはmodel download承認待ちとして扱う。
- sherpa-onnx-nodeはdesign-onlyで、install、dependency change、model/vocoder/tokens/espeak追加はしない。
- MeloTTSはexternal runtime / health-only detect-connect境界を維持し、Python/Docker/model/unidic setupや合成はしない。
- API TTSはopt-in設計のまま、key作成、paid call、外部endpoint送信、default routingはしない。

## Receipt

- decision: `local_tts_boundary_watch`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- result: Local TTS Boundary Watch Result 13
- summary: VOICEVOX / Irodoriはevidence-first、Kokoroはmodel-download approval-gated、sherpa / MeloTTS / APIはdesign-onlyまたはopt-inの境界を維持した。
- safety: install、dependency change、optional dependency change、sherpa-onnx-node install、MeloTTS Python/Docker/model/unidic setup、model download、API call、生成音声、README support claim、latency保証claim、platform support claim、default routing変更はしていない。
- next: 多言語検証境界へ戻る。
