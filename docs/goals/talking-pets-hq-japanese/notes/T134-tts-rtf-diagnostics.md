# T134 TTS RTF diagnostics

## 結論

VOICEVOX / Irodori helperの `--profile-latency` に、WAVから読める `audioDuration` と `rtf` を追加した。

## 変更

- `scripts/wav-duration.mjs` を追加した。
- `scripts/tts-voicebox.mjs` でVOICEVOX WAVのdurationを読み、stderrのlatency行へ `audioDuration` / `rtf` を追加する。
- `scripts/tts-irodori.mjs` でWAV format時だけdurationを読み、stderrのlatency行へ `audioDuration` / `rtf` を追加する。
- 通常stdoutの出力pathは変えない。
- `docs/performance.md` にRTF出力の説明を追加した。

## 検証

- `npm run check:syntax`: pass
- `npm test`: pass
- `npm run check:docs`: pass
- `npm run check:pack`: pass
- `npm run check:release`: pass
- `npm run check:sanitize`: pass
- `npm run test:dry-run`: pass
- `npm run check:all`: local fail at existing Swift CLI error expectation inside `check:platform-scripts`; Node syntax/unit/docs/pack/release/sanitize/dry-run gates passed individually.
- localhost mock smoke: blocked by sandbox `listen EPERM`; covered by unit test for WAV duration and latency audio fields.

## 状態

active。
