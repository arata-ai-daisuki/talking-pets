# T004 Latency Benchmark Output

## Objective

latency benchmark出力を機能アップデートとして見せられる形に改善する。first audio、total、RTF、device infoを表とCSVで扱う。

## Desired User Value

ユーザーや協力者が、自分の端末で測った結果を比較しやすくなり、Talking Petsの改善が「なんとなく速い」ではなく、共有できる証拠として残るようにする。

## Initial Shape

- 既存 `scripts/latency-benchmark.mjs` と `scripts/wav-duration.mjs` を読む。
- first audioが直接測れない場合は、測定不能を明示して空欄または`not measured`にする。
- total、audio duration、RTF、device info、provider、commandを表/CSVへ出す。
- docsではmaintainer referenceとcontributor reportsを分ける。

## Stop Lines

- 実音声生成、model download、外部API callが必要になったら止める。
- 1端末の数字を性能保証として書かない。
- private path、未sanitized log、ローカル会話内容を公開docsへ貼らない。

## Agent Comments

- 速水 光莉: 「速さは数字の形を揃えるだけで、かなり伝わりやすくなります。」
- 白瀬 怜奈: 「first audioが未測定なら未測定と書く。空想の数値は禁止です。」
- 相庭 愛: 「協力者が自分の結果を出しやすい形に寄せます。」

## Receipt

- decision: `latency_benchmark_output`
- owner: `速水 光莉`
- status: active
- result: pending
- next: 既存benchmark出力とlatency table helperを読み、最小のCSV/table改善を実装する。
