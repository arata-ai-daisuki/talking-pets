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
- status: active
- result: pending
- summary: 次はlocal TTS provider設計の境界を、依存追加・model download・API call・support claim変更なしで再確認する。
- next: evidence-first / design-only / approval-gatedの境界を維持できたら、多言語検証境界へhandoffする。
