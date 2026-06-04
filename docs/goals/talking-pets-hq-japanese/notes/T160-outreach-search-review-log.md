# T160 Outreach Search Review Log

## Objective

手動検索で見つけたoutreach候補を、送信済みと混同せず記録できる表を追加する。

## Added

- `docs/research/x-outreach-targets.md` に `Search Review Log` を追加した。
- 候補post/project、fit、evidence need、suggested template、decisionを分けて記録できるようにした。
- `sent` はMasterが手動投稿した後だけ記録するルールを追加した。

## Guardrails

- 自動返信、DM、follow、like、mentionは追加していない。
- private contact details、private DMs、scraped personal dataは記録しない。
- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。

## Receipt

- decision: `outreach_search_review_log`
- result: done
- next: 手動検索で候補を見つけたら、まずこの表にwatch/reply later/skip/sentで記録する。
