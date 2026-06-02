# T024 再開用handoff

Owner role: 文月 栞里

## 目的

別スレッド、未来のあいちゃん、またはMasterが看板を開いた時に、最短で現在地へ戻れるようにする。

このメモはhandoffのみ。stage、commit、push、PR作成、outreach送信、dependency install、model downloadはしない。

## 現在地

```text
HQ: active
Active task: T006
Master判断: waiting
```

T006はまだ閉じない。

## 直近の結論

PR1、PR2、PR3はすべてpreflight上ready。

ただし、推奨実行順は:

```text
1. PR1
2. PR2
3. PR3
4. outreach手動送信
5. sherpa-onnx実験
```

## 次にやるなら

Masterが明示した時だけ実行する:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```

その場合のPR1候補:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

PR1 preflight:

```text
docs/goals/talking-pets-hq-japanese/notes/T020-pr1-preflight.md
```

## 確認コマンド

再開直後にまずこれ:

```bash
node /Users/tsukuyomi/.codex/plugins/cache/goalbuddy/goalbuddy/0.3.8/skills/goalbuddy/scripts/check-goal-state.mjs docs/goals/talking-pets-hq-japanese/state.yaml
git status --short
```

PR1へ進む前:

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
```

## 参照メモ

PR実行:

- `T015-pr-split-execution-rehearsal.md`
- `T020-pr1-preflight.md`
- `T021-pr2-preflight.md`
- `T022-pr3-preflight.md`

判断:

- `T016-master-decision-card.md`
- `T019-hq-status-rollup.md`
- `T023-t006-readiness-audit.md`

outreach:

- `T017-outreach-day1-send-pack.md`
- `T007-outreach-tracking-template.md`

local TTS:

- `T018-local-tts-experiment-pack.md`
- `docs/research/sherpa-onnx-design.md`

## 停止線

Masterの明示なしではやらない:

- stage
- commit
- push
- PR作成
- outreach送信
- DM送信
- dependency install
- model download
- paid/API TTS

## 状態ラベル

```text
PR準備: ready
outreach準備: prepared_not_sent
local TTS実験: prepared_not_executed
多言語fallback: verified_as_fallback_only
T006: waiting_for_master
```
