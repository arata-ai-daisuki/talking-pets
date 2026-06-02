# T036 PR1直前 live verification

Owner role: 白瀬 怜奈

## 目的

PR1保存点を作る前に、最新の作業ツリーでPR1候補ファイルと検証コマンドがまだ通るか確認する。

このメモでは `git add`、commit、push、PR作成はしない。

## PR1候補

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

## 存在確認

結果: pass

```text
ok package.json
ok scripts/pet-rollout-monitor.mjs
ok scripts/tts-kokoro.mjs
ok scripts/tts-voicebox.mjs
ok scripts/latency-benchmark.mjs
ok docs/performance.md
```

注意:

- `scripts/latency-benchmark.mjs` と `docs/performance.md` はuntrackedなので `git diff --stat` には出ない。
- stage時に漏れやすい。

## 検証結果

### `npm run check:syntax`

pass。

### `npm run test:dry-run`

pass。

確認出力:

```text
[source] CI dry run ready.
[pet] CI dry run ready.
```

### `npm run benchmark:latency -- --runs 5`

pass。

dry-run monitor path の `total`:

```text
minMs: 1.9
p50Ms: 2.0
p95Ms: 2.4
maxMs: 2.4
```

注意:

- これは実音声生成、model loading、provider cold start、playback latencyではない。
- PR bodyではdry-run monitor pathとして扱う。

### `zh-rollout.jsonl` diagnostics

pass。

確認値:

```text
detectedLanguage: zh
effectiveLanguage: zh
chosenEngine: say
fallbackReason: zh uses OS speech fallback; no dedicated provider is configured.
```

## 最新git状態

PR1候補のほか、README、fixtures、GoalBuddy、research、demo素材が作業ツリーに混ざっている。

PR1 stage時は次の6ファイルだけ:

```bash
git add package.json scripts/pet-rollout-monitor.mjs scripts/tts-kokoro.mjs scripts/tts-voicebox.mjs scripts/latency-benchmark.mjs docs/performance.md
```

stage後の期待値:

```text
docs/performance.md
package.json
scripts/latency-benchmark.mjs
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
```

## 判断

PR1は最新状態でも実行可能。

T006のMaster判断待ちは継続。

Masterが次の文を言えば、branch作成、stage、検証、commitへ進める:

```text
PR1から進めて。branch作成、stage、検証、commitまでやって。
```
