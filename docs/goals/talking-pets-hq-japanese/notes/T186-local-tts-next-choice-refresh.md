# T186 Local TTS Next Choice Refresh

## Objective

MeloTTS detect-only、sherpa optional install確認、provider feedback intakeを踏まえ、次に進めるlocal TTS小PR候補とMaster承認境界を再評価する。

## Scope

- model download / API call / dependency追加なしで、次候補を比較した。
- MeloTTS、sherpa、Piper、API TTSの現在地をProvider comparisonとdesign notesに照らして整理した。
- 次に進める場合の小PR候補と、Master承認が必要な停止線を分けた。

## Stop Lines

- 依存追加、model download、API callをしない。
- READMEに新provider対応済みclaimを追加しない。
- external runtime installerのdownload/install実装へ進まない。

## Receipt

- decision: `local_tts_next_choice_refresh`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- next: provider experiment scorecard refresh.
