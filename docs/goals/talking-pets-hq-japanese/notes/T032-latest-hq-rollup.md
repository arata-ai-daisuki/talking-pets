# T032 最新HQロールアップ

Owner role: 相庭 愛

## 目的

T029 / T030 / T031 までの追加進捗を含め、GoalBuddy日本語HQでいま何が完了し、何がMaster判断待ちかを一枚で追えるようにする。

このメモは状況整理のみ。stage、commit、push、PR作成、outreach送信、dependency install、model downloadはしない。

## 現在状態

```text
Goal: active
Active task: T006
Task count: 36
判断待ち: Masterが次の優先度を選ぶ
```

全体ゴールはまだ完了ではない。

理由:

- PR保存点はまだ作っていない。
- outreachは送信用キューまで準備済みだが、まだ送っていない。
- local TTS実験は候補比較とsherpa準備までで、依存追加やmodel downloadはしていない。
- 多言語はfixture/routing fallback検証までで、専用TTS品質保証ではない。

## 最新の完了成果

### 1. outreach送信準備

最新メモ:

```text
T030-outreach-day1-latest-queue.md
```

状態:

```text
prepared_not_sent
```

Day 1推奨:

1. OpenClaw / Sogni Voice: X public reply
2. V1GPT: Reddit public comment
3. V1R4: 予備

方針:

- 最大2件。
- 1件だけでもよい。
- 初回でStar依頼しない。
- DMしない。
- 返信がなければ2週間催促しない。

### 2. local TTS設計

最新メモ:

```text
T029-local-tts-shortlist.md
T018-local-tts-experiment-pack.md
docs/research/sherpa-onnx-design.md
```

状態:

```text
prepared_not_executed
```

候補順:

1. `sherpa-onnx-node`
2. `MeloTTS`
3. Piper / Piper ONNX系
4. API TTSはP2 opt-in

方針:

- 第一候補は `sherpa-onnx-node`。
- `MeloTTS` は多言語品質比較の後続候補。
- Piper系は軽量性比較の後続候補。
- API TTSはlocal-firstから外れるため、Master明示承認まで保留。

### 3. 多言語fallback検証

最新メモ:

```text
T031-multilingual-batch-verification.md
T028-multilingual-doc-consistency.md
T003-multilingual-fixture-check.md
```

状態:

```text
verified_as_fallback_only
```

一括検証結果:

| fixture | route |
| --- | --- |
| `ja-rollout.jsonl` | `voicevox` |
| `en-rollout.jsonl` | `kokoro` |
| `ko-rollout.jsonl` | `say` fallback |
| `zh-rollout.jsonl` | `say` fallback |
| `zh-traditional-rollout.jsonl` | `say` fallback |
| `symbol-only-rollout.jsonl` | `say` fallback |

claim boundary:

- `ko` / `zh` は first-class fallback。
- 韓国語/中国語専用TTS対応済みとは言わない。
- 多言語TTS production-readyとは言わない。

### 4. PR保存点準備

状態:

```text
ready_but_not_staged
```

準備済み:

- PR1: latency / diagnostics実装
- PR2: README / 多言語fallback / fixtures
- PR3: Roadmap / research / GoalBuddy / implementation-notes

あいちゃん推奨:

```text
PR1保存点を先に作る。
```

理由:

- 実装と検証コマンドがPR2/PR3の土台になる。
- outreach前にrepoの説明と実装の保存点がある方が安心。
- local TTS実験は依存やmodelが増えるので、今の成果を切ってからが安全。

## Masterが選べる次手

### A. PR1保存点

推奨。

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

push/PR作成まで任せるなら:

```text
PR1から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

### B. outreach手動送信

```text
outreachを優先して。今日送る2件の候補と文面を最終化して。
```

### C. sherpa-onnx実験

```text
sherpa-onnx実験を許可する。依存とmodel downloadの確認から始めて。
```

### D. 別優先度

```text
別の優先度へ変更して。
```

## 停止線

Masterの明示なしではやらない:

- `git add`
- commit
- push
- PR作成
- outreach送信
- DM送信
- dependency install
- model download
- paid/API TTS

## 状態ラベル

```text
HQ: active
PR準備: ready_but_not_staged
outreach準備: prepared_not_sent
local TTS実験: prepared_not_executed
多言語fallback: verified_as_fallback_only
Master判断: waiting
```

## 状態

done。

T006のMaster判断待ちは継続。
