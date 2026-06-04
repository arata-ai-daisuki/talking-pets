# T094 Irodori README caveat

## 結論

Irodori smoke test結果を受けて、README / README.en にcold startとwarm synthesisの注意を追加した。

## 追加した内容

- `/health` はモデルロード前でも返る場合がある
- 初回合成はモデル取得とruntime loadで数分かかることがある
- warm synthesisでも端末状態によって数十秒かかることがある
- timeout時はserver logと `/health` の `runtime.loaded` / `runtime.loading` を見る

## 変更ファイル

- `README.md`
- `README.en.md`
- `docs/goals/talking-pets-hq-japanese/state.yaml`

## 状態

done。
