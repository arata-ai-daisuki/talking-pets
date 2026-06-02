# T023 T006判断待ち監査

Owner role: 相庭 愛

## 目的

T006がまだactiveである理由と、判断材料がどこまで揃っているかを監査する。

このメモは監査だけ。stage、commit、push、PR作成、outreach送信、dependency install、model downloadはしない。

## 現在のT006

```text
status: active
decision: waiting_for_master
```

T006はまだ閉じない。

理由:

- Masterが `PR分割/commitを優先`、`outreach送信を優先`、`sherpa-onnx実験を許可` のどれを選ぶかが未決定。
- stage/commit/push/PR作成は明示承認が必要。
- outreach送信もMaster手動確認が必要。
- sherpa-onnx実験は依存追加とmodel downloadの可能性があるため、明示承認が必要。

## 判断材料の準備状況

### PR保存点

準備済み:

- `T012-pr1-stage-readiness.md`
- `T013-pr2-stage-readiness.md`
- `T014-pr3-stage-readiness.md`
- `T015-pr-split-execution-rehearsal.md`
- `T020-pr1-preflight.md`
- `T021-pr2-preflight.md`
- `T022-pr3-preflight.md`

状態:

```text
PR1: preflight ready
PR2: preflight ready after PR1
PR3: preflight ready after PR1/PR2
```

### outreach

準備済み:

- `T001-outreach-send-prep.md`
- `T007-outreach-tracking-template.md`
- `T017-outreach-day1-send-pack.md`

状態:

```text
prepared_not_sent
```

### local TTS

準備済み:

- `T002-sherpa-decision-gate.md`
- `T018-local-tts-experiment-pack.md`
- `docs/research/sherpa-onnx-design.md`

状態:

```text
prepared_not_executed
```

### 多言語fallback

準備済み:

- `T003-multilingual-fixture-check.md`
- `T010-pr2-review-checklist.md`
- `T013-pr2-stage-readiness.md`
- `T021-pr2-preflight.md`

状態:

```text
verified_as_fallback_only
```

## あいちゃん推奨

次の実行はPR1保存点。

Masterが言えばよい文:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

push/PR作成まで任せる場合:

```text
PR1から進めて。branch作成、stage、検証、commit、push、PR作成までやって。
```

## T006を閉じられる条件

少なくとも次のどれかが必要:

- MasterがPR分割を承認し、PR1保存点を作る。
- Masterがoutreach優先を選び、手動送信候補の最終化または送信記録へ進む。
- Masterがsherpa-onnx実験を許可し、依存/model確認へ進む。
- Masterが別優先度を明示する。

## 監査結果

```text
T006 remains active.
判断材料は十分。
次はMaster選択待ち。
```

全体ゴールはまだ完了ではない。
