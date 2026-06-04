# Performance Notes

Talking Pets のレイテンシ計測メモです。

## 基本方針

最適化する前に、どこで待っているかを分けて測ります。

計測出力は既存の stdout を壊さないため、原則 stderr の `[latency]` 行に出します。

## 現在測れるもの

### Node rollout monitor

```bash
npm run benchmark:dry-run
```

例:

```text
[latency] total=2.9ms resolveThread=0.1ms readLatestSpeechCandidate=0.5ms speechText=0.8ms candidate=true dryRun=true thread=true
```

主な区間:

- `resolveThread`: Codex thread / rollout path の解決。
- `readLatestSpeechCandidate`: rollout JSONLの読み取りとassistant発話候補の抽出。
- `speechText`: 読み上げ文への整形。

複数回のばらつきを見る場合:

```bash
npm run benchmark:latency -- --runs 20
```

このコマンドはdry-runを複数回実行し、`minMs` / `p50Ms` / `p95Ms` / `maxMs` をJSONで出します。最適化前後は単発値ではなく、同じ `--runs` で比較してください。

### Kokoro helper

```bash
node scripts/tts-kokoro.mjs --list-voices --profile-latency
```

実際に音声生成する場合:

```bash
node scripts/tts-kokoro.mjs --text "Benchmark ready." --out /tmp/talking-pets-kokoro.wav --profile-latency
```

主な区間:

- `prepare_cache`: cache directoryの準備。
- `import_kokoro`: `kokoro-js` のimport。
- `load_model`: Kokoro model load。
- `generate`: 音声生成。
- `save`: WAV保存。
- `play`: audio player実行。`--play` 指定時のみ。

Kokoroは初回model downloadやmodel loadが大きく出る可能性があります。cold / warm は分けて見る必要があります。

### VOICEVOX / voicebox helper

```bash
node scripts/tts-voicebox.mjs --mode voicevox --text "ベンチマークです。" --out /tmp/talking-pets-voicevox.wav --profile-latency
```

主な区間:

- `audio_query`: VOICEVOX `/audio_query`。
- `parse_audio_query`: query JSON parse。
- `synthesis`: VOICEVOX `/synthesis`。
- `read_audio`: audio response読み取り。
- `write_audio`: WAV保存。
- `play`: audio player実行。`--play` 指定時のみ。

WAV durationを読み取れる場合、`--profile-latency` は `audioDuration` と `rtf` も出します。`rtf` は `synthesis / audioDuration` です。

VOICEVOX Engine が起動していない場合は、接続失敗が先に出ます。

### Irodori helper

```bash
npm run tts:irodori -- --url http://127.0.0.1:8088 --text "ベンチマークです。" --out /tmp/talking-pets-irodori.wav --profile-latency
```

主な区間:

- `health`: Irodori `/health`。`--health` 指定時のみ。
- `synthesis`: Irodori OpenAI-compatible `/v1/audio/speech` request、audio response読み取り、WAV保存。
- `read_audio`: audio response読み取り。
- `write_audio`: WAV保存。
- `play`: audio player実行。`--play` 指定時のみ。

WAV durationを読み取れる場合、`--profile-latency` は `audioDuration` と `rtf` も出します。

## まだ測れていないもの

- 実際のPet overlay表示から読み上げ開始までの体感時間。
- macOS Swift monitorの詳細な内部区間。
- Kokoro worker常駐時のwarm latency。
- VOICEVOX Engine側の内部処理。
- Windows / Linux実機での再生開始時間。

## 次の最適化候補

| 優先 | 候補 | 先に必要な証拠 |
| --- | --- | --- |
| P0 | poll interval見直し | `--interval` が体感遅延にどれだけ効くか |
| P0 | provider横断の測定軸統一 | `health` / `cold start` / `warm synthesis` / `audio duration` / `rtf` / `playback start` を同じ言葉で記録できること |
| P1 | Kokoro warm mode | cold/warm差が十分大きいこと |
| P1 | rollout JSONL末尾読み | `readLatestSpeechCandidate` が大きいこと |
| P2 | provider process常駐化 | child process起動が主要ボトルネックであること |

Provider候補ごとの比較は [docs/research/tts-provider-comparison.md](research/tts-provider-comparison.md) に分けています。
providerごとの公開claimやdefault routingを変える前に、同ページの `Measurement Rubric` と `Readiness Levels` で、maintainer測定なのか外部contributor検証なのかを分けてください。

現在のcontrol sample:

- macOS `say` via Node monitor: `total=440.1ms`, `speak=434.9ms` on `test/fixtures/assistant-rollout.jsonl`
- VOICEVOX via voicebox helper, speaker 3, running local engine: `list_voices=76.2ms`; warm synthesis totals `1334.3ms` / `1388.6ms` / `2206.6ms` for a `3.861333s` WAV
- VOICEVOX playback-included short run: `total=5693.8ms`, `synthesis=1127.8ms`, `play=4398.6ms`, output duration `3.210667s`
- Kokoro measurement is on hold because no local `~/.cache/talking-pets/transformers` cache was found; first run may require model download.

## 注意

このファイルの数字は環境依存です。READMEやSNSでは、実測前に「1秒未満」などの強い性能保証を書かないでください。
