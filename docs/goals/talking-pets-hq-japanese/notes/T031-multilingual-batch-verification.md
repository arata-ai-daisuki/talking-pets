# T031 多言語fixture一括検証

Owner role: 言守 詞葉

## 目的

PR 2前に、README / README.en の多言語fallback claimが現在のfixture実行結果と一致しているかを、一括で確認できる証跡にする。

## 実行日

2026-06-02

## 実行コマンド

```bash
for f in test/fixtures/ja-rollout.jsonl test/fixtures/en-rollout.jsonl test/fixtures/ko-rollout.jsonl test/fixtures/zh-rollout.jsonl test/fixtures/zh-traditional-rollout.jsonl test/fixtures/symbol-only-rollout.jsonl; do
  printf '\n=== %s ===\n' "$f"
  node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout "$f" | tail -n 14
done
```

## 結果

| fixture | detectedLanguage | effectiveLanguage | chosenEngine | fallbackReason |
| --- | --- | --- | --- | --- |
| `ja-rollout.jsonl` | `ja` | `ja` | `voicevox` | `null` |
| `en-rollout.jsonl` | `en` | `en` | `kokoro` | `null` |
| `ko-rollout.jsonl` | `ko` | `ko` | `say` | `ko uses OS speech fallback; no dedicated provider is configured.` |
| `zh-rollout.jsonl` | `zh` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |
| `zh-traditional-rollout.jsonl` | `zh` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |
| `symbol-only-rollout.jsonl` | `other` | `other` | `say` | `other uses OS speech fallback; no dedicated provider is configured.` |

## README claimとの対応

一致している:

- 日本語は `VOICEVOX` route。
- 英語は `Kokoro` route。
- 韓国語は専用TTSではなく `say` / OS speech fallback。
- 中国語は専用TTSではなく `say` / OS speech fallback。
- 記号だけなど判定不能なものは `other` fallback。

言わない:

- 韓国語専用TTS対応済み。
- 中国語専用TTS対応済み。
- 多言語TTSがproduction-ready。
- 中国語の自然な要約品質が保証済み。

## 注意

`zh-rollout.jsonl` と `zh-traditional-rollout.jsonl` は `detectedLanguage=zh` として正しくfallback routingされる。ただし `spokenText` はsummary処理後の文になるため、中国語の自然な要約品質を保証する証拠にはしない。

## 状態

done。

T006のMaster判断待ちは継続。PR stage、commit、pushはしていない。
