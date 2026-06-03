# T037 PR1実行receipt

Owner role: 相庭 愛

## 目的

Master承認に従って、PR1保存点を branch / stage / verification / commit / push / PR作成まで実行したことを記録する。

## 実行結果

PR1は完了。

```text
branch: codex/talking-pets-latency-routing-diagnostics
commit: 42d2249 Add latency and routing diagnostics
PR: https://github.com/arata-ai-daisuki/talking-pets/pull/6
status: OPEN
```

## stageしたファイル

```text
docs/performance.md
package.json
scripts/latency-benchmark.mjs
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

README、fixtures、GoalBuddy、research、demo素材はPR1へ入れていない。

## 検証

通したコマンド:

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
```

結果:

- syntax: pass
- dry-run: pass
- benchmark: pass
- zh diagnostics: pass

benchmark note:

```text
dry-run monitor path only
not real audio generation
not model loading
not provider cold start
not playback latency
```

## PR本文

Title:

```text
Add latency profiling and routing diagnostics
```

URL:

```text
https://github.com/arata-ai-daisuki/talking-pets/pull/6
```

## 残っている作業ツリー差分

PR2候補:

```text
README.md
README.en.md
FUTURE_PLAN.md
presets/speech-style.json
presets/voices.json
test/fixtures/*-rollout.jsonl
```

PR3候補:

```text
docs/ROADMAP.md
docs/research/**
docs/goals/**
implementation-notes.md
```

PRに混ぜない:

```text
docs/demo/*.mp4
docs/demo/*.png
docs/goals/**/.goalbuddy-board/**
```

## 状態

done。

次はPR2保存点へ進むか、outreach手動送信/local TTS実験へ切り替えるかの判断。
