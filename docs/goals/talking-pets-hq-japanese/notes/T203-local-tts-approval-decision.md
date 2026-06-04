# T203 Local TTS Approval Decision

## Objective

Local TTS Approval Follow-Up SnapshotのA/B/Cから、Master判断が必要な次アクションを確認する。

## Scope

- Local TTS Approval Follow-Up Snapshotを確認する。
- 依存追加なしで、Masterに聞く選択肢を1つのdecision cardへまとめる。
- 判断がない場合はevidence-firstを維持する。

## Stop Lines

- 依存追加、model download、API callをしない。
- README support claimを変えない。
- sherpa/MeloTTSの実装や音声生成をしない。

## Receipt

- decision: `local_tts_approval_decision`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: active
- next: prepare one approval decision card without implementation.
