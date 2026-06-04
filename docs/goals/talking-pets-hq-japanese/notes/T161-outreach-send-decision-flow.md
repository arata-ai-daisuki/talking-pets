# T161 Outreach Send Decision Flow

## Objective

Search Review Logの候補を、いつ送る・送らないか判断できる運用ルールへつなげる。

## Added

- `docs/research/x-outreach-targets.md` に `Decision flow` を追加した。
- `watch` / `reply later` / `skip` / `sent` の意味を明確にした。
- `sent` へ移す前に、templateとaskを1つだけ選ぶルールを追加した。

## Guardrails

- 自動返信、DM、follow、like、mentionは追加していない。
- `sent` はMasterが手動投稿した後だけに限定した。
- private contact details、private DMs、scraped personal dataは記録しない。
- provider実装、依存追加、model download、API callはしていない。

## Receipt

- decision: `outreach_send_decision_flow`
- result: done
- next: 手動検索候補を見つけたらSearch Review Logに入れ、Decision flowでwatch/reply later/skip/sentを選ぶ。
