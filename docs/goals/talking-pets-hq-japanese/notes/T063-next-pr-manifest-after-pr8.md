# T063 next PR manifest after PR8

## 結論

次に保存点PRを作るなら、まずは **HQ receipts only** の小PRが安全。

目的:

- PR #8 merge後に進んだHQ看板の履歴をmainへ保存する。
- local TTSのinstall / model download / provider実装は別PRに分ける。
- outreach送信結果は、Masterが実際に送った後に別receiptとして扱う。

## 推奨branch

```text
codex/talking-pets-hq-post-pr8-receipts
```

## 入れる候補

```text
docs/goals/talking-pets-hq-japanese/state.yaml
docs/goals/talking-pets-hq-japanese/notes/T054-pr8-merged-next-local-tts.md
docs/goals/talking-pets-hq-japanese/notes/T055-sherpa-model-public-metadata-check.md
docs/goals/talking-pets-hq-japanese/notes/T056-outreach-day1-post-merge-send-pack.md
docs/goals/talking-pets-hq-japanese/notes/T057-multilingual-current-claim-audit.md
docs/goals/talking-pets-hq-japanese/notes/T058-hq-current-rollup-after-pr8.md
docs/goals/talking-pets-hq-japanese/notes/T059-local-tts-decision-matrix.md
docs/goals/talking-pets-hq-japanese/notes/T060-sherpa-model-license-public-info.md
docs/goals/talking-pets-hq-japanese/notes/T061-local-tts-next-scope-after-license.md
docs/goals/talking-pets-hq-japanese/notes/T062-outreach-day1-recording-guide.md
```

## 入れない候補

```text
package.json
package-lock.json
node_modules/
model files
generated wav files
docs/demo/*.mp4
README.md
README.en.md
FUTURE_PLAN.md
presets/*.json
test/fixtures/*.jsonl
```

理由:

- local TTS installはMaster判断待ち。
- model downloadは未許可。
- README / presets / fixturesは既にPR #7でmainへ入った波なので、今回の保存点には混ぜない。
- demo mp4はサイズと公開用途の判断が別。

## 検証

PR作成前に実行:

```bash
node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
rg -n "active_task: T061|T054|T055|T056|T057|T058|T059|T060|T061|T062|npm installしない|model downloadしない|まだ送信していない" docs/goals/talking-pets-hq-japanese/state.yaml docs/goals/talking-pets-hq-japanese/notes/T0{54,55,56,57,58,59,60,61,62}-*.md
```

PR作成後に確認:

```bash
gh pr view <PR_NUMBER> --json state,mergeable,url,title,headRefName,baseRefName
gh pr checks <PR_NUMBER>
```

## PR message案

Title:

```text
Record post-PR8 HQ receipts
```

Body:

```markdown
## Summary
- record PR #8 merge receipt and post-merge HQ rollups
- add sherpa package/model/license decision receipts without installing or downloading models
- add outreach Day 1 recording guide while keeping outreach manual-only

## Verification
- node <goalbuddy-check> docs/goals/talking-pets-hq-japanese/state.yaml
- rg -n "active_task: T061|T054|T055|T056|T057|T058|T059|T060|T061|T062|npm installしない|model downloadしない|まだ送信していない" docs/goals/talking-pets-hq-japanese/state.yaml docs/goals/talking-pets-hq-japanese/notes/T0{54,55,56,57,58,59,60,61,62}-*.md
```

## 状態

done。

まだbranch作成、stage、commit、push、PR作成はしていない。
