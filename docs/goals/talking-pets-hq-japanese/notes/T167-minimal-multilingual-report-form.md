# T167 Minimal Multilingual Report Form

## Objective

多言語fallback / dedicated provider evidenceを、外部協力者が短く報告できるMinimal Multilingual Report Formとして追加する。

## Added

- `docs/real-device-verification.md` に `Minimal Multilingual Report Form` を追加した。
- `docs/verification-status.md` から簡易フォームへリンクした。
- `activity-index.md` をT167の現在地に更新した。

## Guardrails

- Korean / Chinese dedicated provider support claimは追加していない。
- provider実装、依存追加、model download、API callはしていない。
- generated audio添付を推奨していない。
- READMEの対応provider claimは増やしていない。

## Receipt

- decision: `minimal_multilingual_report_form`
- result: done
- next: 手動outreachで多言語TTSの協力者が出た時、このフォームを貼って短く報告してもらう。
