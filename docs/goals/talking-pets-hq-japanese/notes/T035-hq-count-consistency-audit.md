# T035 HQ count整合性監査

Owner role: 白瀬 怜奈

## 目的

T034追加後、GoalBuddy日本語HQの `task_count` と主要ロールアップ内の `Task count` 表記が矛盾していないか確認する。

このメモでは stage、commit、push、PR作成はしない。

## 現在のGoalBuddy checker結果

```text
goal_status: active
active_task: T006
task_count: 36
errors: []
warnings: []
```

## 見つけたズレ

`T032-latest-hq-rollup.md` に古い値が残っていた。

```text
Task count: 33
```

## 修正

`T032-latest-hq-rollup.md` を現在値に合わせた。

```text
Task count: 36
```

`state.yaml` 内のT032/T034/T035 receiptの確認コマンドも `Task count: 36` に合わせた。

## 履歴として残すもの

`T025-goalbuddy-board-health.md` の `task_count: 26` は、当時のhealth check記録なので修正しない。

理由:

- T025は過去時点の観測receipt。
- 最新状態の正本はGoalBuddy checkerとT032/T034。

## 検証

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
rg -n "Task count: 36|active_task: T006|task_count: 36|T006" docs/goals/talking-pets-hq-japanese/notes/T032-latest-hq-rollup.md docs/goals/talking-pets-hq-japanese/notes/T034-master-decision-card-latest.md
```

## 状態

done。

T006のMaster判断待ちは継続。
