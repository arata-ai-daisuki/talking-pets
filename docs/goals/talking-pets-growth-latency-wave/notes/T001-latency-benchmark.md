# T001 Latency Benchmark Receipt

Owner role: 速水 光莉

## Result

Done.

`scripts/latency-benchmark.mjs` now supports `--out PATH`, so repeated dry-run benchmark summaries can be saved as local receipts.

## Receipt

Saved JSON summary:

- `docs/goals/talking-pets-growth-latency-wave/notes/T001-latency-summary.json`

20-run dry-run result:

- total p50: 3.3ms
- total p95: 6.0ms
- total max: 6.1ms
- readLatestSpeechCandidate p95: 0.8ms
- speechText p95: 2.2ms

## Commands

```bash
npm run check:syntax
npm run benchmark:latency -- --runs 20 --out docs/goals/talking-pets-growth-latency-wave/notes/T001-latency-summary.json
```

Both passed.

## Interpretation

This only measures the dry-run Node monitor path. It does not include real audio generation, model loading, VOICEVOX engine time, Kokoro cold start, OS audio playback, or perceived overlay-to-audio time.

The next performance slice should measure provider startup/generation separately, starting with local providers.
