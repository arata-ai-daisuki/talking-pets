# T040 PR1 merged / next PR2 gate

## 結論

PR #6 は GitHub 上で merge 済み。

- PR: https://github.com/arata-ai-daisuki/talking-pets/pull/6
- Title: Add latency profiling and routing diagnostics
- State: MERGED
- Base: main
- Head: codex/talking-pets-latency-routing-diagnostics
- Merge commit: a7a165f154b4314abeabea7382c3efdfa942fbdb
- Merged at: 2026-06-02 06:16:26 UTC
- Merged at JST: 2026-06-02 15:16:26

## これで完了した波

PR1 保存点は完了。

- レイテンシ計測 CLI
- provider routing diagnostics
- diagnostics / benchmark docs
- GitHub CI green
- conflict 解消
- main への merge

## 次のおすすめ

次は PR2 保存点を推奨。

理由:

- PR1 が main に入ったので、README の見せ方と多言語 fallback claim を外部公開面にそろえるのが自然。
- 既に PR2 候補は preflight 済み。
- outreach や local TTS 実験より前に、repo を見に来た人が迷わない状態を作れる。

PR2 候補:

- README.md
- README.en.md
- FUTURE_PLAN.md
- presets/speech-style.json
- presets/voices.json
- test/fixtures/ja-rollout.jsonl
- test/fixtures/en-rollout.jsonl
- test/fixtures/ko-rollout.jsonl
- test/fixtures/zh-rollout.jsonl
- test/fixtures/zh-traditional-rollout.jsonl
- test/fixtures/symbol-only-rollout.jsonl

## マスター判断待ち

次に進むなら:

`PR2から進めて。branch作成、stage、検証、commit、push、PR作成までやって。`

commit までで止めるなら:

`PR2から進めて。branch作成、stage、検証、commitまでやって。`

## Guardrail

- まだ outreach 送信はしない。
- sherpa-onnx-node の依存追加や model download はしない。
- PR2 に GoalBuddy docs、outreach docs、demo mp4/png は混ぜない。
- 既存の uncommitted worktree 差分を壊さない。

## Verification

- `gh pr view 6 --json state,mergedAt,mergeCommit,url,title,headRefName,baseRefName`
- `git status --short --branch`
