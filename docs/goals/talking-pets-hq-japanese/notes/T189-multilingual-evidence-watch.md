# T189 Multilingual Evidence Watch

## Objective

Minimal Multilingual Report FormとIssue導線がREADMEへ出たので、外部証跡が来た時の処理順を保つ。

## Scope

- fallback-only / provider-specific / provider feedback intakeの記録順を見える化する。
- 韓国語・中国語のOS speech fallbackをdedicated provider supportとして扱わない。
- 外部返信やIssueを待たず、安全な内部作業を継続できる形にする。

## Stop Lines

- generated audio、private logs、private contact detailsを求めない。
- README support claimを外部実機証跡なしに変更しない。
- provider実装、依存追加、model download、API callをしない。

## Receipt

- decision: `multilingual_evidence_watch`
- owner: `言守 詞葉`
- status: active
- next: document evidence handling order for multilingual reports.
