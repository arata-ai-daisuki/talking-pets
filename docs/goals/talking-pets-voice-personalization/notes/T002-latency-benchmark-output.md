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
