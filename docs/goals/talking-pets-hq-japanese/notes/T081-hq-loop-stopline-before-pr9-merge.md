# T081 HQ loop stopline before PR9 merge

## 結論

PR #9がmergeされるまで、HQ receiptsだけのmanifest更新はここで止める。

理由は、T074 / T076 / T078 / T080で十分に次savepointの正本が更新されており、これ以上は「進捗」ではなくmanifest churnになりやすいから。

## 現在の正本

次savepoint manifestの正本:

```text
docs/goals/talking-pets-hq-japanese/notes/T080-next-savepoint-refresh-after-one-screen.md
```

対象:

```text
docs/goals/talking-pets-hq-japanese/state.yaml
docs/goals/talking-pets-hq-japanese/notes/T069-*.md
docs/goals/talking-pets-hq-japanese/notes/T070-*.md
docs/goals/talking-pets-hq-japanese/notes/T071-*.md
docs/goals/talking-pets-hq-japanese/notes/T072-*.md
docs/goals/talking-pets-hq-japanese/notes/T073-*.md
docs/goals/talking-pets-hq-japanese/notes/T074-*.md
docs/goals/talking-pets-hq-japanese/notes/T075-*.md
docs/goals/talking-pets-hq-japanese/notes/T076-*.md
docs/goals/talking-pets-hq-japanese/notes/T077-*.md
docs/goals/talking-pets-hq-japanese/notes/T078-*.md
docs/goals/talking-pets-hq-japanese/notes/T079-*.md
docs/goals/talking-pets-hq-japanese/notes/T080-*.md
```

## PR #9状態

- PR: https://github.com/arata-ai-daisuki/talking-pets/pull/9
- state: `OPEN`
- mergeable: `MERGEABLE`
- GitHub CI:
  - ubuntu-latest: success
  - macos-latest: success
  - windows-latest: success

## ここから先にやること

PR #9 merge前:

- 追加のmanifest更新はしない。
- outreach送信はMasterが手で行う場合だけ。
- npm install、model download、API callはMaster明示承認があるまでしない。
- 必要ならT079を見て判断する。

PR #9 merge後:

1. origin/main base worktreeで `codex/talking-pets-hq-after-pr9-followups` を作る。
2. T080のmanifestどおりHQ receipts T069-T080を次savepoint PRにする。
3. その後T061判断に戻る。

## 例外

PR #9 merge前でも、次の場合だけ新しいHQ noteを追加してよい。

- Masterが明示的に新しい判断や作業を依頼した。
- PR #9の状態が変わった。
- outreachを実際に送信したのでT007へ記録する必要がある。
- 返信が来たのでT077に沿って記録する必要がある。
- install/API/model downloadなどの明示承認が出た。

## 状態

done。

PR #9 merge、Issue作成、outreach送信、返信送信、npm install、model download、API callはしていない。
