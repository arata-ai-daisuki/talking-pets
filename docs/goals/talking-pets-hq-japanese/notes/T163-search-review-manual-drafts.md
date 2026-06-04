# T163 Search Review Manual Drafts

## Objective

Search Review Logの候補ごとに、Masterが手動で送るための短い公開返信ドラフトを用意する。

## Added

- `docs/research/x-outreach-targets.md` に `Candidate-Specific Manual Drafts` を追加した。
- `myshell-ai/MeloTTS`、`apinge/MeloTTS.cpp`、MOSS-TTS-Nano、offline TTS CPU benchmark thread向けの短い返信案を用意した。
- どの文面もfirst touchを公開返信に限定し、Star依頼やDM誘導を入れていない。

## Guardrails

- 自動返信、DM、follow、like、mentionはしていない。
- `sent` にはしていない。
- private contact details、private DMs、scraped personal dataは記録していない。
- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。

## Receipt

- decision: `search_review_manual_drafts`
- result: done
- next: Masterが送る時は、対象threadが現在も関連しているか確認してから、1候補につき1文面だけ使う。
