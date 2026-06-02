# T038 PR1後の次判断

Owner role: 相庭 愛

## 目的

PR1保存点ができた後、次にPR2保存点、outreach手動送信、local TTS実験のどれへ進むかをMasterに確認する。

## 現在状態

```text
PR1: done, PR #6 open
PR2: ready after PR1
PR3: ready after PR1/PR2
outreach: prepared_not_sent
local TTS: prepared_not_executed
multilingual fallback: verified_as_fallback_only
```

## あいちゃん推奨

次はPR2保存点。

理由:

- PR2はREADME / FUTURE_PLAN / presets / fixturesで、PR1のdiagnostics実装に自然につながる。
- 多言語fallback claimは一括検証済み。
- outreach前にREADMEの見え方を整えると、外部に見せやすい。

## Masterが言えばよい文

PR2を進める:

```text
PR2から進めて。branch作成、stage、検証、commitまでやって。
```

PR作成まで任せる:

```text
PR2から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

outreachへ切り替える:

```text
outreachを優先して。今日送る2件の候補と文面を最終化して。
```

local TTS実験へ切り替える:

```text
sherpa-onnx実験を許可する。依存とmodel downloadの確認から始めて。
```

## 停止線

Masterの明示なしではやらない:

- PR2 stage
- commit
- push
- PR作成
- outreach送信
- DM送信
- dependency install
- model download

## 状態

active。
