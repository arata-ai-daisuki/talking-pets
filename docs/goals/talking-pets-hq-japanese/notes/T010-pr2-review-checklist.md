# T010 PR 2 セルフレビューchecklist

Owner role: 白瀬 怜奈

## 対象

PR 2: README / fallback wording / 多言語fixtures

想定stage候補:

```text
README.md
README.en.md
FUTURE_PLAN.md
presets/speech-style.json
presets/voices.json
test/fixtures/ja-rollout.jsonl
test/fixtures/en-rollout.jsonl
test/fixtures/ko-rollout.jsonl
test/fixtures/zh-rollout.jsonl
test/fixtures/zh-traditional-rollout.jsonl
test/fixtures/symbol-only-rollout.jsonl
```

## レビュー観点

### 1. READMEの主張が盛りすぎていないか

- [ ] `ko` / `zh` を専用TTS対応のように書いていない。
- [ ] READMEでは「routing fallback」または「OS speech fallback」として説明している。
- [ ] Star導線は自然で、機能保証や過度な煽りになっていない。
- [ ] 日本語READMEと英語READMEで説明の温度差が大きすぎない。

### 2. presetsとdocsが一致しているか

- [ ] `presets/voices.json` の `ko` / `zh` がOS speech fallbackとして扱われている。
- [ ] `presets/speech-style.json` の言語fallback説明とREADMEの説明が矛盾しない。
- [ ] `FUTURE_PLAN.md` が「今できること」と「今後やること」を混ぜていない。

### 3. fixture coverageが十分か

- [ ] `ja` / `en` / `ko` / `zh` / `zh-traditional` / `symbol-only` のfixtureがある。
- [ ] symbol-only fixtureで空または記号だけの入力が安全に扱われる。
- [ ] Chinese Traditionalのroutingが、少なくとも診断で確認できる。
- [ ] fixturesが外部APIや実音声再生を必要としない。

### 4. diagnosticsで証明できるか

- [ ] `npm run test:dry-run` が通る。
- [ ] `ko` fixtureでrouting diagnosticsが出る。
- [ ] `zh-traditional` fixtureでrouting diagnosticsが出る。
- [ ] diagnostics modeではdry-runのまま、音声再生やprovider接続が走らない。

### 5. 注意して書くべき境界

- [ ] 「多言語対応」は現時点ではrouting/fallback/fixture検証を指す。
- [ ] 実際の中国語・韓国語TTS品質保証とは書かない。
- [ ] Chinese summaryの先頭文が落ちる可能性がある場合、end-to-end自然発話として強く主張しない。
- [ ] このPRでは外部TTS API、model download、依存追加を含めない。

## 推奨検証コマンド

```bash
npm run check:syntax
npm run test:dry-run
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
```

## 実行済み確認

- `npm run check:syntax`: pass
- `npm run test:dry-run`: pass
- `ko-rollout.jsonl` diagnostics: pass。`fallbackReason` はOS speech fallbackとして出る。
- `zh-traditional-rollout.jsonl` diagnostics: pass。`fallbackReason` はOS speech fallbackとして出る。

注意: `zh-traditional-rollout.jsonl` はsource全体では繁体字を検出するが、summary処理後の `spokenText` では先頭文が落ちる。PRやSNSでは、多言語の範囲をrouting/fallback/fixture検証に限定して書く。

## レビュー時の赤信号

- `ko` / `zh` を「音声品質まで対応済み」と読める書き方にしている。
- READMEとpresetでfallback説明が違う。
- fixture追加だけなのに、provider接続や依存追加が混ざっている。
- Star導線が押し売りっぽい。
- diagnosticsなしで多言語claimを出している。
