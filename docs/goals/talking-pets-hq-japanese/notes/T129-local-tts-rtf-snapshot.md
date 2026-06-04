# T129 local TTS RTF snapshot

## 結論

ダウンロードなし、依存追加なし、API呼び出しなしで、既存のVOICEVOX/Irodori測定値からRTFを追記した。

RTFは `synthesis time / audio duration`。`1.0x` 未満なら音声の長さより速く生成できていて、`1.0x` を超えると音声の長さより生成に時間がかかっている。

## 追記した比較

| provider | warm synthesis | audio duration | derived RTF | memo |
| --- | --- | --- | --- | --- |
| VOICEVOX | 1388.6ms, 2206.6ms, 1334.3ms | 3.861333s | 0.36x, 0.57x, 0.35x | running-engine benchmark |
| VOICEVOX short run | 1127.8ms | 3.210667s | 0.35x | playback-included runだがRTFはsynthesisだけで計算 |
| Irodori | 16.7s, 10.1s, 9.6s | about 3.92s | 4.26x, 2.58x, 2.45x | maintainer M1 reference device |

## 判断

- VOICEVOXはこのmaintainer測定では生成だけならreal-timeより速い。
- Irodoriはこのmaintainer M1 reference deviceではreal-timeより遅い。
- ただしIrodoriは設定と端末性能の影響が大きそうなので、issue #25で別CPU/GPUの結果を集めてから判断する。
- `playback-included total` は再生完了待ちを含むため、生成速度の比較には使わない。

## 次

1. issue #25 / #26 で同じRTF表に足せる形の報告を待つ。
2. Kokoroはmodel download承認があるまで保留する。
3. sherpa-onnx-nodeとAPI TTSは依存追加/API keyが絡むので設計のみ。

## 状態

active。
