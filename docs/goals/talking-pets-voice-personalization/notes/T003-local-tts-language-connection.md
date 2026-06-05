# T003 Local TTS / Language Connection

## 担当

- 歌澄 音羽: TTS Worker
- 言守 詞葉: Language Worker

## 目的

local TTS providerと言語対応を、provider registry、preferences、routing diagnostics、READMEへ接続する。

## 期待する成果

- local TTS providerの対応状況がREADME/docsから分かる。
- user preferencesのprovider優先度とrouting diagnosticsが、言語fallback理由とつながる。
- fallback-onlyとprovider-specific supportを混同しない。
- 少なくとも1つのlocal TTS provider改善または追加につながる小PR候補を確定する。

## 停止線

- 新規providerを証拠なしにsupportedとclaimしない。
- model downloadが必要になったら、まずdocsまたはdry-run境界から扱う。
- external runtimeのinstall/downloadはMaster承認なしに実行しない。

## 実装結果

- `providerPriorityTrace()` を追加し、preferencesのprovider優先度をdiagnosticsで追えるようにした。
- `routingDiagnostic()` に `providerSelection` を追加。
- `providerSelection.candidates[]` でprovider、language、supportLevel、claimBoundary、selectableを表示する。
- 未検証providerは `unknown` のまま残し、`fallback-only` または `provider-specific` の候補だけを選ぶ。
- README/README.en/docsに `providerSelection` の読み方を追加。

## 検証

- `node --check src/user-preferences.js`
- `node --check scripts/pet-rollout-monitor.mjs`
- `node --no-warnings --test`
- `node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --preferences presets/preferences.local-first.json --rollout test/fixtures/ko-zh-rollout.jsonl`
- `npm run check:docs`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`
