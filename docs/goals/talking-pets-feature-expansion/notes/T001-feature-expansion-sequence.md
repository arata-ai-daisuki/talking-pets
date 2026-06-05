# T001 Feature Expansion Sequence

## Objective

機能拡張ゴールの最初の実装順序を決める。

## Scope

対象は、対応ローカルTTS、対応言語、Voice系LLM/API、ユーザー好み反映、性能改善。

## Draft Direction

最初の小PR候補は、provider capability registryを追加すること。

理由:

- ユーザー設定、言語対応、diagnostics、README claim、latency表の土台になる。
- 依存追加やmodel downloadなしで進められる。
- 機能アップデートとして「Talking Pets can now show what voice providers and languages are available on your setup」と言いやすい。

## Stop Lines

- 依存追加しない。
- model downloadしない。
- API callしない。
- secretを保存しない。
- Korean / Chineseをdedicated provider supportとしてclaimしない。

## Receipt

- decision: `feature_expansion_sequence`
- owner: `相庭 愛 / 白瀬 怜奈`
- status: active
- result: pending
- next: 現行コードのprovider/routing/config構造を確認し、最初の小PRをprovider capability registryにするかJudgeする。
