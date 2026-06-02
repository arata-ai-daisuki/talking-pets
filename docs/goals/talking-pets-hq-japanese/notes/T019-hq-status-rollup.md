# T019 HQステータスrollup

Owner role: 相庭 愛

## 目的

GoalBuddy HQを見た時に、完了済みの波、保留中の判断、次の実行候補がすぐ分かるようにする。

このメモは状況整理のみ。stage、commit、push、PR作成、outreach送信、dependency install、model downloadはしない。

## 全体状態

```text
Goal: active
Active task: T006
判断待ち: Masterが次の優先度を選ぶ
```

全体ゴールはまだ完了ではない。

理由:

- PR保存点はまだ作っていない。
- outreachは送信準備だけで、まだ送っていない。
- local TTS実験は設計/準備だけで、依存追加やmodel downloadはしていない。
- 多言語対応はfallback/fixtures/routing診断の範囲で、専用TTS品質保証ではない。

## 完了済みの波

### Roadmap / HQ

- `docs/ROADMAP.md` を追加。
- STELLAVOX / 星声機構の担当設定を整理。
- 日本語HQ看板を作成。
- 完了済みGoalBuddy波を履歴として扱う方針にした。

### レイテンシ計測

- `--profile-latency` をmonitorとTTS helperへ追加。
- `scripts/latency-benchmark.mjs` を追加。
- `docs/performance.md` を追加。
- dry-run monitor pathのbenchmarkを確認済み。

### routing diagnostics / 多言語fallback

- `--diagnose-routing` を追加。
- `ko` / `zh` をfirst-class OS speech fallbackとして整理。
- `ja` / `en` / `ko` / `zh` / `zh-traditional` / `symbol-only` fixturesを追加。
- Korean / Chineseは専用TTS対応済みとは書かない方針。

### outreach準備

- SNS outreach strategyを作成。
- X/Reddit/GitHub向けtarget listを作成。
- Day 1送信用パックを作成。
- 手動送信、最大2件、初手Star依頼なし、自動DMなしの方針。

### local TTS設計

- `sherpa-onnx-node` を第一候補として設計。
- 実験前チェック、model/license確認、helper最小仕様、中止条件を整理。
- 依存追加、model download、音声生成は未実行。

### PR保存点準備

- PR 1 stage精査完了。
- PR 2 stage精査完了。
- PR 3 stage精査完了。
- PR分割実行リハーサル完了。
- Master決裁カード作成済み。

## まだ実行していないこと

```text
git add
commit
push
PR作成
outreach投稿/DM
sherpa-onnx dependency install
model download
paid/API TTS
```

## 次の3手

### 1. PR1から保存点を作る

あいちゃん推奨。

Masterの許可文:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

push/PR作成まで任せるなら:

```text
PR1から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

### 2. outreachを手動で送る

準備済み:

- OpenClaw / Sogni Voice
- V1GPT

Masterの許可文:

```text
outreachを優先して。今日送る2件の候補と文面を最終化して。
```

注意:

- 実際の送信はMasterが手動。
- 自動投稿しない。
- 初手Star依頼しない。

### 3. sherpa-onnx実験を始める

Masterの許可文:

```text
sherpa-onnx実験を許可する。依存とmodel downloadの確認から始めて。
```

注意:

- PR1保存点の後が安全。
- install/downloadは段階的に確認する。

## あいちゃん推奨順

```text
1. PR1保存点
2. PR2保存点
3. PR3保存点
4. outreach手動送信
5. sherpa-onnx実験
```

理由:

- repoの見え方を安定させてからoutreachした方がよい。
- local TTS実験は依存とmodelが増えるので、現在の成果を保存してからが安全。
- 多言語fallbackとレイテンシ計測は、PR化すると外部に説明しやすくなる。

## 現在の停止線

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

## 状態ラベル

```text
HQ: active
PR準備: ready
outreach準備: prepared_not_sent
local TTS実験: prepared_not_executed
多言語fallback: verified_as_fallback_only
Master判断: waiting
```
