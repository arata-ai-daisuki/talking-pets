# T009 PR 1 セルフレビューchecklist

Owner role: 白瀬 怜奈

## 対象

PR 1: レイテンシ計測とrouting diagnostics

想定stage候補:

```text
package.json
scripts/pet-rollout-monitor.mjs
scripts/tts-kokoro.mjs
scripts/tts-voicebox.mjs
scripts/latency-benchmark.mjs
docs/performance.md
```

## レビュー観点

### 1. 通常出力を壊していないか

- [ ] `npm run test:dry-run` で `[source]` と `[pet]` が従来どおりstdoutに出る。
- [ ] `--profile-latency` の出力はstderrで、通常stdoutを壊さない。
- [ ] `--diagnose-routing` を指定しない時、JSON診断は出ない。

### 2. 診断modeが安全か

- [ ] `--diagnose-routing` はdry-runを強制する。
- [ ] 診断modeで音声再生しない。
- [ ] 診断modeでVOICEVOX/Kokoro/外部APIへ接続しない。
- [ ] 診断JSONに `fallbackReason` が出る。
- [ ] `ko` / `zh` は専用provider対応ではなくOS speech fallbackとして見える。

### 3. benchmarkが比較可能か

- [ ] `npm run benchmark:latency -- --runs 5` が通る。
- [ ] 出力に `minMs` / `p50Ms` / `p95Ms` / `maxMs` がある。
- [ ] `--out` でJSON receiptを保存できる。
- [ ] 単発値だけで性能claimしない。

### 4. TTS helper profiling

- [ ] `scripts/tts-kokoro.mjs --list-voices --profile-latency` がstdout JSONを壊さない。
- [ ] Kokoroのlatencyはstderrに出る。
- [ ] VOICEVOX helperは既存の接続失敗時挙動を変えていない。
- [ ] `--profile-latency` がない時は通常挙動に戻る。

### 5. claimの境界

- [ ] PR bodyで「1秒未満」などの保証を書かない。
- [ ] docs/performance.mdが「dry-run monitor path」と「実音声生成」を分けている。
- [ ] provider cold start / model download / playback latencyを未測定として扱っている。

## 推奨検証コマンド

```bash
npm run check:syntax
npm run test:dry-run
npm run benchmark:latency -- --runs 5
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
node scripts/tts-kokoro.mjs --list-voices --profile-latency
```

## レビュー時の赤信号

- stdoutにlatency行が混ざる。
- diagnostics modeで音が鳴る。
- API/providerへ接続しないはずの診断で接続が走る。
- `ko` / `zh` を dedicated support のように書いている。
- benchmark結果をSNS/READMEで強く保証している。
