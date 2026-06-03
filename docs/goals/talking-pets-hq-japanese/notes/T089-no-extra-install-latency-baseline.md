# T089 no-extra-install latency baseline

## 結論

追加インストールなし、音声生成なし、Irodori server起動なしで、言語別fixtureのdry-run latency baselineを取った。

これはTTS生成時間ではなく、Talking Pets monitorがrolloutを読み、発話候補を抽出し、routing前のspeechTextを処理するまでのbaseline。

## 実行条件

- `npm install`: していない
- model download: していない
- API call: していない
- Irodori server起動: していない
- 実音声再生: していない
- 実音声生成: していない

## 結果

30-run dry-run。

| fixture | expected route | total p50 | total p95 | total max | speechText p95 |
| --- | --- | ---: | ---: | ---: | ---: |
| `test/fixtures/ja-rollout.jsonl` | VOICEVOX | 2.6ms | 6.6ms | 9.1ms | 1.7ms |
| `test/fixtures/en-rollout.jsonl` | Kokoro | 2.3ms | 3.8ms | 5.0ms | 1.3ms |
| `test/fixtures/ko-rollout.jsonl` | say fallback | 2.6ms | 5.2ms | 8.8ms | 2.2ms |
| `test/fixtures/zh-rollout.jsonl` | say fallback | 3.4ms | 5.5ms | 6.2ms | 1.8ms |

## 解釈

monitor側のdry-run処理はp95でおおむね10ms未満。

ただし、ここには以下が含まれない。

- VOICEVOX/Kokoro/Irodori/sayの起動時間
- TTS synthesis時間
- audio file write時間
- playback開始までの時間
- ユーザーが感じるoverlay表示から最初の音までの時間

次の改善ポイントは、providerごとの `first audio` / `synthesis complete` / `playback start` を分けて測ること。

## コマンド

```bash
npm run benchmark:latency -- --runs 30 --rollout test/fixtures/ja-rollout.jsonl --out /private/tmp/talking-pets-ja-latency-baseline.json
npm run benchmark:latency -- --runs 30 --rollout test/fixtures/en-rollout.jsonl --out /private/tmp/talking-pets-en-latency-baseline.json
npm run benchmark:latency -- --runs 30 --rollout test/fixtures/ko-rollout.jsonl --out /private/tmp/talking-pets-ko-latency-baseline.json
npm run benchmark:latency -- --runs 30 --rollout test/fixtures/zh-rollout.jsonl --out /private/tmp/talking-pets-zh-latency-baseline.json
```

全てpass。

## 次の判断

実音声provider測定へ進む前に、Master判断が必要。

- Irodori serverをMaster側で起動してhealth/synthesis smoke testへ進む
- 既存providerのうち、外部依存なしで測れる `say` だけ実音声latencyを取る
- 実音声はまだ触らず、測定設計とREADMEのlatency caveatを先に整理する

## 状態

done。
