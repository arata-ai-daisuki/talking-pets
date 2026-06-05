# T001 Worktree / Goal Switch Audit

## 担当

- 相庭 愛: Producer
- 白瀬 怜奈: Judge

## 目的

方針転換に伴い、旧feature-expansion看板と途中ブランチを壊さず、新しいvoice-personalization看板へ切り替える。

## 現状

- 旧看板: `docs/goals/talking-pets-feature-expansion/`
- 新看板: `docs/goals/talking-pets-voice-personalization/`
- T004 latency benchmark outputの途中成果:
  - branch: `codex/talking-pets-latency-benchmark-output`
  - checkpoint commit: `fc131f1`
  - 内容: Markdown/CSV/JSON benchmark summary、device info、first-audio境界、テスト追加

## 分類

| 対象 | 扱い | 理由 |
| --- | --- | --- |
| 旧HQ看板 | 履歴として保持 | outreachや運用活動のログが残っているため |
| 旧feature-expansion看板 | 履歴として保持 | provider registry/preferences/installer docsの進捗証拠があるため |
| T004 latency branch | 再利用候補として保持 | 新ゴールの性能改善にそのまま使えるため |
| main作業ツリー | 新ゴール準備ブランチへ移行 | 方針転換後のGoalBuddy切り替えを小PR化するため |

## 停止線

- `git reset --hard` や削除はしない。
- 旧ブランチを勝手に消さない。
- 旧GoalBuddy履歴を上書きしない。
- T004 checkpointは新ゴールの再利用候補として扱い、必要時にcherry-pickまたはPR化する。

## 検証

- YAMLとして `state.yaml` が読めること。
- GoalBuddy boardが新slugで開けること。
- mainから見て小PR化できる差分だけにすること。
