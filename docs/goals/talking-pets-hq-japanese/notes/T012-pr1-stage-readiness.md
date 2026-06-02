# T012 PR 1 stage精査メモ

Owner role: 文月 栞里

## 対象

PR 1: レイテンシ計測とrouting diagnostics

stage候補:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

## 差分確認

既存tracked差分:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

未追跡だがPR 1へ含めるべき差分:

```text
scripts/latency-benchmark.mjs
docs/performance.md
```

## PR 1に入れてよい理由

- `package.json` はsyntax checkにbenchmark scriptを加え、dry-run benchmarkコマンドを追加している。
- `scripts/pet-rollout-monitor.mjs` は `--profile-latency` と `--diagnose-routing` を追加している。
- `scripts/tts-kokoro.mjs` はKokoro helperのlatency区間をstderrへ出すだけで、stdout JSONやvoice listを壊さない設計。
- `scripts/tts-voicebox.mjs` はVOICEVOX/generic endpoint helperのlatency区間をstderrへ出すだけで、通常出力を壊さない設計。
- `scripts/latency-benchmark.mjs` はmonitor dry-runを複数回実行し、`minMs` / `p50Ms` / `p95Ms` / `maxMs` のJSON summaryを出す。
- `docs/performance.md` は測定できる範囲と未測定範囲を分け、性能claimを抑制している。

## PR 1に入れないもの

```text
README.md
README.en.md
FUTURE_PLAN.md
presets/speech-style.json
presets/voices.json
test/fixtures/*-rollout.jsonl
docs/ROADMAP.md
docs/research/**
docs/goals/**
implementation-notes.md
docs/demo/*.mp4
docs/demo/*.png
```

理由:

- README / presets / fixturesはPR 2の多言語fallback claimとfixturesに寄せる。
- Roadmap / research / GoalBuddy / implementation-notesはPR 3のdocs束に寄せる。
- demo素材は未追跡で、PR 1のレイテンシ計測とは別判断。

## stageするならこのコマンド

まだ実行していない。Masterが `PR分割/commitを優先` を選んだ後に使う。

```bash
git add package.json scripts/pet-rollout-monitor.mjs scripts/tts-kokoro.mjs scripts/tts-voicebox.mjs scripts/latency-benchmark.mjs docs/performance.md
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
- `npm run test:dry-run`: pass。通常stdoutの `[source]` / `[pet]` が出る。
- `npm run benchmark:latency -- --runs 5`: pass。dry-run monitor pathの `total` は `minMs=1.9` / `p50Ms=2.0` / `p95Ms=2.7` / `maxMs=2.8`。
- `zh-rollout.jsonl` diagnostics: pass。`fallbackReason` はOS speech fallbackとして出る。

注意: このbenchmark値はdry-run monitor pathだけを測ったもの。実音声生成、model load、provider cold start、再生開始時間の保証には使わない。

## 判断

PR 1は小さく切れる。

注意点は2つ:

- `scripts/latency-benchmark.mjs` と `docs/performance.md` は未追跡なので、stage時に忘れやすい。
- `docs/performance.md` は日本語docsなので、英語README反映はPR 2またはPR 3で補う。
