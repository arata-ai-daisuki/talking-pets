# T016 Master決裁カード

Owner role: 相庭 愛

## いまの状態

GoalBuddy HQは継続active。

完了済み:

- PR 1 stage精査
- PR 2 stage精査
- PR 3 stage精査
- PR分割実行リハーサル
- outreach手動送信準備
- sherpa-onnx local TTS設計
- 多言語fallback/fixtures検証

未実行:

- `git add`
- commit
- push
- PR作成
- outreach投稿/DM
- sherpa-onnx依存追加
- model download
- paid/API TTS

## あいちゃん推奨

次は `PR分割/commitを優先`。

さらに細かく言うと、PR 1だけ先に切る。

理由:

- 現在の差分は実装、README、fixtures、GoalBuddy、researchが混ざっている。
- PR 1はレイテンシ計測とrouting diagnosticsだけで、検証コマンドに直結している。
- PR 1が入ると、PR 2のREADME diagnostics説明と多言語fallback claimが自然になる。
- outreachやlocal TTS実験へ進む前に、repoの保存点を作る方が安全。

## Masterが選べる選択肢

### A. PR 1から保存点を作る

あいちゃん推奨。

実行すること:

1. branch作成
2. PR 1候補だけstage
3. 検証
4. commit
5. 必要ならpush/PR作成

PR 1候補:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

Masterが言えばよい文:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

push/PR作成も任せるなら:

```text
PR1から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

### B. outreach手動送信を優先する

実行すること:

1. `T001-outreach-send-prep.md` と `x-outreach-targets.md` を見て候補を2件まで選ぶ。
2. Masterが手動で送る文を最終化する。
3. 送信ログに記録する。

注意:

- 自動投稿しない。
- 自動DMしない。
- 初手Star依頼しない。
- 同じ相手へ連投しない。

Masterが言えばよい文:

```text
outreachを優先して。今日送る2件の候補と文面を最終化して。
```

### C. sherpa-onnx local TTS実験を許可する

実行すること:

1. `sherpa-onnx-node` の依存とlicenseを再確認する。
2. model downloadサイズと保存場所を確認する。
3. 実験用PRまたは別branchを切る。
4. 明示許可後にinstall/downloadする。

注意:

- 依存追加が入る。
- model downloadが入る可能性が高い。
- PR分割前に始めると差分がさらに大きくなる。

Masterが言えばよい文:

```text
sherpa-onnx実験を許可する。依存とmodel downloadの確認から始めて。
```

### D. PRはまだ切らず、docsをさらに磨く

実行すること:

1. READMEのStar導線や多言語表現をさらに見直す。
2. outreach候補を追加調査する。
3. GoalBuddy HQの表示や日本語化を追加で調整する。

注意:

- 保存点が遅れる。
- 差分がさらに増える。

Masterが言えばよい文:

```text
まだPRは切らず、docsと見せ方をもう少し磨いて。
```

## あいちゃんの停止線

Masterの明示なしではやらない:

- stage
- commit
- push
- PR作成
- outreach送信
- DM送信
- dependency install
- model download
- paid/API TTS

## 現在の結論

3本のPR準備は完了。

いちばん安全な次手は:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

push/PR作成まで一気に任せるかは、Masterの好みで分ける。
