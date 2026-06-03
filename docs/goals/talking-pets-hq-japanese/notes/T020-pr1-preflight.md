# T020 PR 1 preflight

Owner role: 白瀬 怜奈

## 目的

MasterがPR 1実行を許可した時に、stage直前で混入や取りこぼしがないか確認する。

このメモではまだ `git add`、commit、push、PR作成はしない。

## PR 1候補

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

## 現在の差分状態

tracked差分:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

untrackedだがPR 1に入れる:

```text
scripts/latency-benchmark.mjs
docs/performance.md
```

## stage前チェック

- [ ] PR 1候補6ファイルだけをstageする。
- [ ] `README.md` / `README.en.md` はstageしない。
- [ ] `FUTURE_PLAN.md` はstageしない。
- [ ] `presets/**` はstageしない。
- [ ] `test/fixtures/*-rollout.jsonl` はstageしない。
- [ ] `docs/ROADMAP.md` / `docs/research/**` / `docs/goals/**` はstageしない。
- [ ] `implementation-notes.md` はPR 3へ寄せるためstageしない。
- [ ] `docs/demo/*.mp4` / `docs/demo/*.png` はstageしない。

## stageコマンド

Master承認後にだけ実行する。

```bash
git add package.json scripts/pet-rollout-monitor.mjs scripts/tts-kokoro.mjs scripts/tts-voicebox.mjs scripts/latency-benchmark.mjs docs/performance.md
```

## stage後の確認コマンド

stageした後に実行する。

```bash
git diff --cached --name-only
```

期待値:

```text
docs/performance.md
package.json
scripts/latency-benchmark.mjs
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

## PR 1検証コマンド

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
```

## 実行済み確認

- GoalBuddy state check: pass。`goal_status: active` / `active_task: T006` のまま。
- `npm run check:syntax`: pass。
- `npm run test:dry-run`: pass。
- `npm run benchmark:latency -- --runs 5`: pass。dry-run monitor pathの `total` は `minMs=1.9` / `p50Ms=1.9` / `p95Ms=2.3` / `maxMs=2.4`。
- `zh-rollout.jsonl` diagnostics: pass。`detectedLanguage=zh` / `effectiveLanguage=zh` / OS speech fallback。
- PR 1 tracked差分4ファイルとuntracked 2ファイルを再確認した。

## commit案

```bash
git commit -m "Add latency and routing diagnostics"
```

## 赤信号

- `git diff --cached --name-only` にREADME、GoalBuddy、fixtures、demo素材が混ざる。
- `docs/performance.md` または `scripts/latency-benchmark.mjs` をstageし忘れる。
- benchmark結果を実音声生成の性能保証としてPR bodyに書く。
- diagnostics modeで音声再生やprovider接続をするように見える。

## 現在の判断

PR 1はpreflight上もready。

Master承認があれば、次はbranch作成、stage、検証、commitへ進める。
