# T169 HQ Backlog Board

## Objective

Backlog / Next / Active / Doneを日本語で一覧できるHQ Backlog Boardを追加し、未実施の全体像と完了済み波の履歴を見える化する。

## Added

- `docs/goals/talking-pets-hq-japanese/hq-backlog-board.md` を追加した。
- Backlog / Next / Active / Doneを日本語カード化した。
- outreach送信準備、local TTS設計、多言語検証、provider調査、README/SNS導線を見える化した。
- GoalBuddy看板、HQ Activity Index、ROADMAP、provider comparison、verification docsへリンクした。
- `goal.md` と `activity-index.md` からHQ Backlog Boardへリンクした。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- 自動投稿、DM、follow、like、mentionはしていない。
- READMEの対応provider claimは増やしていない。
- 未実施カードをdone扱いしていない。

## Receipt

- decision: `hq_backlog_board`
- result: done
- next: Backlog BoardのNext列から、Master判断または次の小PR候補を選ぶ。
