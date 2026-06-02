# T003 多言語fixture診断メモ

Owner role: 言守 詞葉

## 結果

完了。

`--diagnose-routing` を使い、日本語・英語・韓国語・簡体字中国語・繁体字中国語・記号だけのfixtureを確認した。

## 追加したfixture

- `test/fixtures/ja-rollout.jsonl`
- `test/fixtures/en-rollout.jsonl`
- `test/fixtures/zh-traditional-rollout.jsonl`
- `test/fixtures/symbol-only-rollout.jsonl`

既存fixture:

- `test/fixtures/ko-rollout.jsonl`
- `test/fixtures/zh-rollout.jsonl`

## 診断結果

| fixture | detectedLanguage | chosenEngine | fallbackReason |
| --- | --- | --- | --- |
| `ja-rollout.jsonl` | `ja` | `voicevox` | なし |
| `en-rollout.jsonl` | `en` | `kokoro` | なし |
| `ko-rollout.jsonl` | `ko` | `say` | OS speech fallback |
| `zh-rollout.jsonl` | `zh` | `say` | OS speech fallback |
| `zh-traditional-rollout.jsonl` | `zh` | `say` | OS speech fallback |
| `symbol-only-rollout.jsonl` | `other` | `say` | OS speech fallback |

## README claim確認

現在のREADME claimは妥当:

- 日本語はVOICEVOX。
- 英語はKokoro.js。
- 韓国語・中国語・その他はOS speech fallback。
- `ko` / `zh` は専用TTS provider対応ではなく、first-class fallback path。

修正した点:

- README / README.en の `voices.json` 抜粋に `ko` / `zh` fallback entryを追加した。

## 注意点

中国語fixtureでは、短い最初の文がsummary処理で落ちる場合がある。これはprovider routingの問題ではなく、読み上げ文選択の挙動。中国語の自然さを強く主張する前に、summary ruleの追加検証が必要。

## 実行コマンド

```bash
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ja-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/en-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/symbol-only-rollout.jsonl
```
