# T166 HQ Activity Index

## Objective

Masterがカンバンとサブエージェント活動を一覧で見られるHQ Activity Indexを追加する。

## Added

- `docs/goals/talking-pets-hq-japanese/activity-index.md` を追加した。
- GoalBuddy Kanban URL、active task、Kanban Snapshot、Agent Activity Summary、Recent Wave、次に見る場所を1ページにまとめた。
- `goal.md` からActivity Indexへリンクした。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- 自動投稿、DM、follow、like、mentionはしていない。
- 活動一覧は `state.yaml` のsnapshotであり、GoalBuddy本体の代替ではない。

## Receipt

- decision: `hq_activity_index`
- result: done
- next: 新しいtaskがmergeされたら、このsnapshotも必要に応じて更新する。
