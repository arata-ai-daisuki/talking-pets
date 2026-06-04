# T187 Provider Experiment Scorecard Refresh

## Objective

T186のlocal TTS next choice refreshを受けて、Provider Experiment Scorecardを現在の証跡と停止線に合わせて更新する。

## Scope

- VOICEVOX / Irodoriはevidence-firstとして扱った。
- Kokoroはmodel-download承認待ちのmeasurement-onlyに留めた。
- sherpa / MeloTTS / Piper / API TTSはdesign-only、license/runtime/privacyの境界を保った。
- 次の小PR候補とMaster承認が必要な実験を分けた。

## Stop Lines

- 依存追加、model download、API callをしない。
- READMEに新provider対応済みclaimを追加しない。
- generated audioを作らない。

## Receipt

- decision: `provider_experiment_scorecard_refresh`
- owner: `歌澄 音羽 / 白瀬 怜奈`
- status: done
- next: outreach send queue refresh.
