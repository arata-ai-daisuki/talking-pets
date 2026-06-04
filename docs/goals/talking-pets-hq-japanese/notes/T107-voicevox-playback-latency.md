# T107 VOICEVOX playback latency

## 結論

VOICEVOXの再生込み測定を短文1回だけ実行した。

## 実行条件

- provider: `voicevox`
- speaker: `3`
- text: `こんにちは。再生込みの測定です。`
- playback: あり
- output: `/private/tmp/talking-pets-voicevox-play.wav`

## 結果

```text
[latency] total=5693.8ms audio_query=164.1ms parse_audio_query=1.8ms synthesis=1127.8ms read_audio=0.9ms write_audio=0.2ms play=4398.6ms provider=voicevox success=true play=true
```

Generated audio:

```text
RIFF WAVE, Microsoft PCM, 16 bit, mono 24000 Hz
estimated duration: 3.210667 sec
```

## 読み方

`total` は再生完了まで含む。体感の「声が出始めるまで」とは違う。

今回の生成待ちは主に `synthesis=1127.8ms`。`play=4398.6ms` は再生コマンドの完了待ちを含むため、音声長の影響を受ける。

## 状態

done。
