# T118 multilingual public claim recheck

## 結論

多言語対応の公開claimを再確認した。

README / README.en は、韓国語・中国語を専用TTS provider対応済みとしては書いていない。

現時点の方針は、READMEの多言語説明を強めず、言語routingとOS speech fallbackの範囲として扱うことでよい。

## 確認すること

| 項目 | 結果 |
| --- | --- |
| README / README.en が、ko/zh専用TTS対応済みのように読めないこと | pass |
| fixtures のdry-runが、ja/en/ko/zh/other routingを壊していないこと | pass |
| `VOICEVOX = Japanese`, `Kokoro = English`, `OS speech fallback = other languages` の境界が維持されていること | pass |
| 外部Issueの募集文面が、多言語品質保証のように読めないこと | pass |

## routing診断結果

| Fixture | detected | chosenEngine | fallbackReason |
| --- | --- | --- | --- |
| `test/fixtures/ja-rollout.jsonl` | `ja` | `voicevox` | none |
| `test/fixtures/en-rollout.jsonl` | `en` | `kokoro` | none |
| `test/fixtures/ko-rollout.jsonl` | `ko` | `say` | `ko uses OS speech fallback; no dedicated provider is configured.` |
| `test/fixtures/zh-rollout.jsonl` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |
| `test/fixtures/zh-traditional-rollout.jsonl` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |
| `test/fixtures/symbol-only-rollout.jsonl` | `other` | `say` | `other uses OS speech fallback; no dedicated provider is configured.` |

## やらないこと

- Korean / Chinese 専用provider対応済みclaim
- new provider install
- model download
- API call
- READMEの強いclaim追加

## 状態

done。
