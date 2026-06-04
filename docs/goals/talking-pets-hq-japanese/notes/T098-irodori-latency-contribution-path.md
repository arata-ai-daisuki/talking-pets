# T098 Irodori latency contribution path

## 結論

Irodoriの速度は設定と端末性能で大きく変わるため、試験端末スペックと外部データ提供フォーマットを公開導線に追加した。

## 追加した内容

- README / README.en に、Irodori latencyは端末性能、CPU/GPU/MPS/CUDA/ROCm、設定、テキスト長、cold/warm状態で変わることを追記
- `docs/real-device-verification.md` に `Irodori Latency Contribution` を追加
- Platform verification issue templateに `Irodori-TTS Server` と任意のIrodori latency欄を追加
- `docs/verification-status.md` にMaintainer reference resultを追加
- `CONTRIBUTING.md` からIrodori latency contributionへ誘導

## Maintainer reference

- Device: MacBook Air, Apple M1, 8 CPU cores, 7-core Apple M1 GPU, 8 GB RAM
- OS: macOS 26.5.1 / arm64
- Node.js / npm: v24.2.0 / 11.6.4
- Irodori backend observed in server log: MPS, fp32
- Health: 49.8ms
- Warm-up with runtime load: 33.4s client-side, 33.17s server-side
- Warm synthesis runs: 16.7s, 10.1s, 9.6s
- Output audio duration: about 3.92s

## 状態

done。
