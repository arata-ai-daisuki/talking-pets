# T002 Latency Benchmark Output

## 担当

- 速水 光莉: Performance Worker

## 目的

保存済みcheckpoint commit `fc131f1` のlatency benchmark output改善を、新ゴール最初の機能PRとしてmainへ取り込む。

## 期待する成果

- `scripts/latency-benchmark.mjs` がJSON/Markdown/CSVを出せる。
- 出力にdevice infoを含める。
- first-audioはdry-runでは `not_measured` として明示する。
- `docs/performance.md` に協力者が報告しやすい使い方を書く。
- テストと `npm run check:all` を通す。

## 停止線

- 実音声やmodel downloadが必要になったら止める。
- 外部API callやpaid APIが必要になったら止める。
- 1端末のlatency値を保証値として書く必要が出たら止める。

## 実装結果

- `scripts/latency-benchmark.mjs` に `--format json|markdown|csv` を追加。
- benchmark summaryにdevice infoを追加。
- dry-runで測れないfirst audioは `not_measured` として明示。
- `scripts/latency-lines-to-table.mjs` の表カラムにfirst audio/device系を追加。
- `docs/performance.md` にMarkdown/CSV出力と協力者報告向けの注意を追加。
- `--runs` は正の整数だけ受け付けるようにした。

## 検証

- `node --check scripts/latency-benchmark.mjs`
- `node --no-warnings --test`
- `npm run benchmark:dry-run`
- `npm run benchmark:latency -- --runs 2 --format markdown`
- `npm run benchmark:latency -- --runs 2 --format csv`
- `ruby -e 'require "yaml"; YAML.load_file("docs/goals/talking-pets-voice-personalization/state.yaml"); puts "yaml: ok"'`
- `npm run check:docs`
- `CLANG_MODULE_CACHE_PATH=/private/tmp/talking-pets-clang-module-cache npm run check:all`
