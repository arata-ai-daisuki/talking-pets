# Feature Expansion Activity Log

機能拡張ゴールのエージェント活動ログです。

## 2026-06-05

### Kickoff

- 相庭 愛: 「ゴールを運用中心から機能開発中心へ切り替えました。完了条件はprovider registry、user preference config、diagnostics、latency、Voice/API opt-inです。」
- 白瀬 怜奈: 「最初の実装は依存追加なしで進めるべきです。provider capability registryなら安全に始められます。」
- 歌澄 音羽: 「VOICEVOX/Irodori/Kokoro/Melo/sherpa/APIを同じ表で扱えるようにしましょう。対応言語、download要否、API要否、statusが必要です。」
- 言守 詞葉: 「言語は`supported`だけでなく、`fallback-only`と`provider-specific`を分けたいです。」
- 速水 光莉: 「registryができたらlatency benchmarkの結果もproviderに結びつけられます。」

### Handoff

Next active task: `T001 feature_expansion_sequence`

ProducerからJudgeへ:

> provider capability registryを最初の小PRにするか、既存routing/config構造を見て判断してください。まだ実装せず、置き場所・schema・検証コマンドを決めるところまで。
