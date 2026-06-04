# T091 worktree cleanup before Irodori smoke

## 結論

Irodori smoke testへ進む前に、閉じられるworktreeを整理した。

## 実行した整理

- `git worktree prune`
- `<codex-worktree>/f886/talking-pets` をremove
- `<codex-worktree>/f024/talking-pets` をremove

## 残したworktree

| path | 理由 |
| --- | --- |
| `<main-worktree>` | 未整理差分があるため触らない |
| `/private/tmp/talking-pets-after-outreach-local-tts` | PR #14がOPENの作業worktree |
| `<codex-worktree>/irodori-provider` | 未整理差分があるため触らない |

## 確認

`git worktree list --porcelain` で上記3つだけ残っていることを確認。

## 状態

done。
