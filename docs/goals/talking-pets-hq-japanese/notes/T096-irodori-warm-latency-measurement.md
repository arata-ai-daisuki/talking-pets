# T096 Irodori warm latency measurement

## 結論

Irodori-TTS-Serverのwarm synthesisを3回測った。

結果として、runtime loaded後の短文合成でも約9.6秒から16.7秒かかった。

## 実行条件

- server: Irodori-TTS-Server on `http://127.0.0.1:8088`
- provider: `scripts/tts-irodori.mjs`
- voice: `none`
- format: `wav`
- playback: なし
- output: `/private/tmp` のみ
- text: `こんにちは。Talking Petsのウォーム測定です。`

## health

```text
[latency] total=49.8ms health=49.7ms provider=irodori success=true health=true
```

起動直後のhealthでは `runtime.loaded=false`。

## warm-up

runtime load込みのwarm-up:

```text
[latency] total=33407.6ms read_audio=15.5ms write_audio=4.4ms synthesis=33403.0ms provider=irodori success=true play=false
```

server log:

- checkpoint cache lookup: 0.29s
- runtime loaded: 16.25s
- server-side synthesis completed: 33.17s
- audio seconds: 4.32s

## warm synthesis 3 runs

| run | total | synthesis | output |
| --- | ---: | ---: | --- |
| 1 | 16708.0ms | 16701.8ms | 3.92s wav |
| 2 | 10096.2ms | 10094.4ms | 3.92s wav |
| 3 | 9565.2ms | 9560.9ms | 3.92s wav |

Summary:

- min: 9565.2ms
- p50: 10096.2ms
- max: 16708.0ms

## ファイル確認

```text
RIFF WAVE, Microsoft PCM, 16 bit, mono 48000 Hz
estimated duration: 3.920000 sec
```

## 判断

README caveatの「warm synthesisでも数十秒かかる可能性がある」は実測と合っている。

現状のIrodoriは、かわいい高品質候補としては有望だが、即応latency用途ではcold start対策とwarm latency expectationを分けて扱う必要がある。

## 状態

done。
