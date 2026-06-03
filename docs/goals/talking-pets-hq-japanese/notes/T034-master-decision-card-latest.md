# T034 Master決裁カード 最新版

Owner role: 相庭 愛

## 目的

T032 / T033 時点の最新状態を踏まえて、Masterが次の一手をコピペで選べるようにする。

このメモは判断用。stage、commit、push、PR作成、outreach送信、dependency install、model downloadはしない。

## 現在状態

```text
GoalBuddy HQ: active
Active task: T006
Task count: 36
Master判断: waiting
```

準備済み:

- PR1 / PR2 / PR3 の分割境界
- PR1の最新リスク監査
- outreach Day 1 最新キュー
- local TTS候補ショートリスト
- 多言語fixture一括検証
- 最新HQロールアップ

未実行:

- `git add`
- commit
- push
- PR作成
- outreach投稿/DM
- `sherpa-onnx-node` 依存追加
- model download
- paid/API TTS

## あいちゃん推奨

次は PR1保存点。

理由:

- PR1は実装中心で、検証コマンドに直結している。
- PR2のREADME / 多言語fallback説明はPR1のdiagnostics実装に依存する。
- outreach前にrepoの実装面の保存点を作った方が見せやすい。
- local TTS実験は依存やmodelが増えるので、今の成果を切ってからが安全。

## 選択肢

### A. PR1保存点を作る

あいちゃん推奨。

Masterが言えばよい文:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

push/PR作成まで任せるなら:

```text
PR1から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

実行対象:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

### B. outreachを優先する

Masterが言えばよい文:

```text
outreachを優先して。今日送る2件の候補と文面を最終化して。
```

候補:

1. OpenClaw / Sogni Voice
2. V1GPT
3. V1R4は予備

注意:

- 実送信はMaster手動。
- 自動投稿しない。
- DMしない。
- 初回Star依頼しない。

### C. local TTS実験を始める

Masterが言えばよい文:

```text
sherpa-onnx実験を許可する。依存とmodel downloadの確認から始めて。
```

注意:

- まず確認だけ。
- package installやmodel downloadは段階的に扱う。
- あいちゃん推奨は、PR1保存点の後。

### D. 別優先度へ変更する

Masterが言えばよい文:

```text
別の優先度へ変更して。
```

## 一番短い返事

推奨どおりでよければ:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

PRまで一気にいくなら:

```text
PR1から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

## 停止線

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

## 状態

done。

T006のMaster判断待ちは継続。
