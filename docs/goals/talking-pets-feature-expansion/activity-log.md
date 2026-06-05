# Feature Expansion Activity Log

機能拡張ゴールのエージェント活動ログです。

## 2026-06-05

### Kickoff

- 相庭 愛: 「ゴールを運用中心から機能開発中心へ切り替えました。完了条件はprovider registry、user preference config、diagnostics、latency、Voice/API opt-inです。」
- 白瀬 怜奈: 「最初の実装は依存追加なしで進めるべきです。provider capability registryなら安全に始められます。」
- 歌澄 音羽: 「VOICEVOX/Irodori/Kokoro/Melo/sherpa/APIを同じ表で扱えるようにしましょう。対応言語、download要否、API要否、statusが必要です。」
- 言守 詞葉: 「言語は`supported`だけでなく、`fallback-only`と`provider-specific`を分けたいです。」
- 速水 光莉: 「registryができたらlatency benchmarkの結果もproviderに結びつけられます。」
- 月城 奏: 「installだけで終わるとユーザーが不安になります。updateとuninstall、config/cache保持、rollbackまでゴールに入れます。」

### Handoff

Next active task: `T001 feature_expansion_sequence`

ProducerからJudgeへ:

> provider capability registryを最初の小PRにするか、既存routing/config構造を見て判断してください。まだ実装せず、置き場所・schema・検証コマンドを決めるところまで。

### Scope Update

- 相庭 愛: 「Master要望により、インストーラー高度化、アンインストール、更新対応を正式な完了条件へ追加しました。」
- 月城 奏: 「installer作業は、既存設定保持、cache削除選択、external runtime境界、rollback手順を分けて扱います。」
- 白瀬 怜奈: 「uninstall/updateは破壊操作に見えやすいので、dry-runまたはdocsで削除候補を明示してから実装します。」

### T001 Judge Result

- 相庭 愛: 「最初の小PRはprovider capability registryにします。機能拡張の背骨です。」
- 歌澄 音羽: 「`presets/voices.json` と monitor optionに散っているprovider情報を、registryとして読みやすくします。」
- 言守 詞葉: 「言語は`fallback-only`と`provider-specific`を分けて持たせます。韓国語/中国語の過剰claimを防ぎます。」
- 月城 奏: 「installer/update/uninstallはT006で早めに設計します。registryとcache/runtime境界を接続します。」
- 白瀬 怜奈: 「T002では依存追加、model download、API call、support claim変更は禁止です。」

Handoff:

> T002 Workerへ: provider capability registryの最小実装に進んでください。まずは機械可読なprovider/language/status metadataと、dry-runまたはdiagnosticsから見える導線を作ること。実装前に既存testとrelease checksの期待を崩さないこと。

### T002 Worker Result

- 歌澄 音羽: 「provider capability registryを`src/provider-capabilities.js`へ追加しました。CLIからprovider一覧が見えます。」
- 言守 詞葉: 「routing diagnosticsに`capability`を入れました。fallback-onlyとprovider-specificが同じJSONで確認できます。」
- 白瀬 怜奈: 「依存追加、model download、API call、secret保存はありません。README support claimも強めていません。」

Handoff:

> T006 Judgeへ: installer/update/uninstall安全設計へ進んでください。provider registryの`needsExternalRuntime`、`needsModelDownload`、`needsApiKey`を使い、既存設定・cache・external runtime・secret・rollback境界を分けてください。削除やuninstall実行はまだ行わないこと。
