# T168 Multilingual Report Form Follow-Up

## Objective

Minimal Multilingual Report Formを、手動outreachの返信で渡せる短いfollow-up文にする。

## Added

- `docs/research/x-outreach-targets.md` に `Multilingual report form follow-up` を追加した。
- fallback-only / provider-specific evidenceを分けることを明示した。
- generated audioやprivate logsを添付しないよう文面に入れた。
- `activity-index.md` をT168の現在地に更新した。

## Guardrails

- 自動返信、DM、follow、like、mentionはしていない。
- `sent` にはしていない。
- generated audioやprivate logsの添付を求めていない。
- Korean / Chinese dedicated provider support claimは追加していない。

## Receipt

- decision: `multilingual_report_form_followup_copy`
- result: done
- next: 手動outreachで相手が多言語TTS evidenceを出せそうな時だけ、このfollow-up文を使う。
