# T069 next decision one-pager

## 結論

次の判断は、まだT061の2択でよい。

あたしの推奨は **B: outreach優先**。

理由は、PR #9でHQ保存点が整い、local TTSはinstall前の安全確認が済んでいる一方で、スターや反応を増やすには手動outreachが今いちばん外へ効くから。

## A: npm installだけ試す

Master許可文:

```text
package確認とlicense公開情報はOK。npm installだけ試して。model downloadはまだしない。optionalDependencies案で進めて。
```

最初のPR範囲:

- `package.json`
- `package-lock.json`
- `docs/goals/talking-pets-hq-japanese/notes/**`
- `docs/goals/talking-pets-hq-japanese/state.yaml`

やること:

- main base worktreeで新branchを作る。
- `sherpa-onnx-node` を optionalDependencies として追加する。
- lockfile差分を確認する。
- `npm run check:all` を実行する。
- GitHub CIのubuntu / macOS / Windowsを見る。

やらないこと:

- model download
- archive展開
- 音声生成
- helper実装
- README対応済みclaim
- default routing

止める条件:

- native build toolchainが必要になる。
- lockfile差分が想定より大きい。
- CIでOS差分が大きく壊れる。
- installだけでREADME claim変更が必要になりそうになる。

## B: outreach優先

Master許可文:

```text
model downloadはまだしない。local TTSは保留してoutreachを優先して。
```

最初の作業:

- T056のDay 1 send-packから、Masterが手動で送る。
- 送ったらT062の記入行をT007へ貼る。
- 反応が来たらT007へ返信ログを追加する。

優先順:

1. V1GPT Reddit postへ公開コメント
2. OpenClaw / Sogni Voice X postへ公開reply
3. V1R4 projectへの軽い紹介

やらないこと:

- 自動投稿
- 自動DM
- follow / like / mention代行
- 初手Star依頼
- private contact探し

## あいちゃん判断

外向きの反応を作る目的ならB。

技術検証を前に進める目的ならA。

どちらでも、model downloadはまだしない。

## PR #9状態

PR #9はHQ保存点。

- state: `OPEN`
- mergeable: `MERGEABLE`
- local `npm run check:all`: pass
- GitHub CI: 再実行中

## 状態

done。

判断待ち。
