# T162 Search Review Candidates

## Objective

公開検索で見つけたprovider-specific / local multilingual TTS候補を、送信済みと混同せずSearch Review Logへ記録する。

## Checked Public Sources

- `myshell-ai/MeloTTS`
- `apinge/MeloTTS.cpp`
- MOSS-TTS-Nano r/LocalLLaMA announcement
- Offline TTS CPU benchmark r/TextToSpeech post

## Added

- `docs/research/x-outreach-targets.md` の `Search Review Log` に4候補を追加した。
- decisionは `reply later` または `watch` のみで、`sent` にはしていない。
- `Sources Checked` に参照URLを追加した。

## Guardrails

- 自動返信、DM、follow、like、mentionはしていない。
- private contact details、private DMs、scraped personal dataは記録していない。
- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。

## Receipt

- decision: `search_review_candidates`
- result: done
- next: Masterが手動で送る時は、各行のdecision flowに従い、templateとaskを1つだけ選ぶ。
