# T088 next local TTS scope after Irodori

## 結論

Masterの「返信待ちの間に先に進めようか」を、あいちゃん推奨の **B: no-extra-install latency baseline** 許可として扱い、T089で実行した。

## 選択肢 A: Irodori smoke test

Master許可文:

```text
Irodori-TTS Serverはローカルで起動した。health checkと短文1つの合成だけ試して。model取得や外部APIは追加しない。
```

実行すること:

- `npm run tts:irodori -- --health --url http://127.0.0.1:8088`
- 短文1つを `--tts irodori --no-language-route` でdry-run/実音声確認
- `--profile-latency` でhealth/synthesis/write/playの目安を記録

停止線:

- Irodori serverが起動していない
- model downloadや別process起動が必要
- 参照音声や利用規約の追加確認が必要

## 選択肢 B: no-extra-install latency baseline

Master許可文:

```text
Irodoriはまだ起動しない。追加インストールなしでsay/autoのlatency baselineだけ測って。
```

実行すること:

- `say` / `auto` のdry-runと可能ならOS speech latencyを測る
- 実音声が不要ならdry-run/routing/benchmarkだけに留める
- README claimは変えない

## 選択肢 C: sherpaは後回し

Master許可文:

```text
sherpa-onnx-nodeは後回し。Irodoriと既存providerのdocs/issue/README整理を優先して。
```

実行すること:

- sherpaのinstall判断をP2へ落とす
- Irodori provider request / verification issueを作るか判断する
- public-facing docsの「次に手伝ってほしいこと」を更新する

## あいちゃん推奨

今は **B: no-extra-install latency baseline** が一番安全。

理由:

- outreach返信待ちの間に、外部依存なしで進む。
- Irodori serverやmodelを起動しないので、環境依存が少ない。
- V1GPT/OpenClawから返信が来た時に、latencyの話へつなげやすい。

## 状態

done。

選択: B。

引き継ぎ先: T089。
