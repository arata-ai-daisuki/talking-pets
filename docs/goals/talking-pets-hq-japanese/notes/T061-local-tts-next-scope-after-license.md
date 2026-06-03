# T061 local TTS next scope after license

## 結論

T053で残っていた `model license公開情報調査` はT060で完了した。

次の判断は2択に絞る。

1. `npm install` だけ試す。
2. local TTSをいったん保留してoutreach / README改善を優先する。

## ここまで完了

| item | status | note |
| --- | --- | --- |
| package metadata | done | `T052` |
| model/vocoder asset size | done | `T055` |
| license公開情報深掘り | done | `T060` |
| PR #8 merge反映 | done | `T054` |

## まだやらないこと

- model download
- archive展開
- 音声生成
- READMEにsherpa対応済みclaim追加
- 自動outreach

## 選択肢 A: npm installだけ試す

Master許可文:

```text
package確認とlicense公開情報はOK。npm installだけ試して。model downloadはまだしない。
```

実行するなら:

- branchを切る。
- `npm install sherpa-onnx-node` の差分を見る。
- `package.json` / `package-lock.json` のサイズと内容を確認する。
- `npm run check:all` を実行する。
- CI platform差分を想定してPR化する。

## 選択肢 B: local TTS保留

Master許可文:

```text
model downloadはまだしない。local TTSは保留してoutreachを優先して。
```

実行するなら:

- T056のDay 1 outreachをMaster手動送信へ進める。
- T007へ送信ログを残す。
- README / demo / Star導線の小PRを検討する。

## あいちゃん判断

技術的には、次に `npm installだけ` 試す準備は整った。

ただし、公開repoの反応を増やす目的なら、local TTSをいったん保留してoutreachを先に動かすのも筋がいい。

## 状態

active。

Master判断待ち。
