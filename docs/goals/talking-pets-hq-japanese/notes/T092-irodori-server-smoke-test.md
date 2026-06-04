# T092 Irodori server smoke test

## 結論

Irodori-TTS-Serverを `/private/tmp/Irodori-TTS-Server` にcloneし、local serverを起動してsmoke testした。

結果:

- health: pass
- short synthesis: pass
- output: `/private/tmp/talking-pets-irodori-smoke.wav`
- audio: wav, 48kHz, mono, 16-bit PCM, 4.04s

## 実行条件

- server URL: `http://127.0.0.1:8088`
- startup: `uv run --extra cpu python -m irodori_openai_tts --host 127.0.0.1 --port 8088`
- voice: `none`
- playback: なし
- output path: `/private/tmp/talking-pets-irodori-smoke.wav`

## 注意

初回合成ではモデル取得とruntime loadが発生した。

- checkpoint download/cache lookup: 273.17s
- runtime loaded: 419.02s
- 初回client request: 約301sでclient側timeout
- server側では初回synthesis完了: 481.06s

runtime loaded後の再試行は成功。

```text
[latency] total=29449.5ms read_audio=10.5ms write_audio=3.7ms synthesis=29445.6ms provider=irodori success=true play=false
```

health確認:

```text
[latency] total=37.2ms health=37.1ms provider=irodori success=true health=true
```

## 検証

```bash
npm run tts:irodori -- --health --url http://127.0.0.1:8088 --profile-latency
npm run tts:irodori -- --url http://127.0.0.1:8088 --voice none --model irodori-tts --format wav --text "こんにちは。Talking PetsのIrodori smoke testです。" --out /private/tmp/talking-pets-irodori-smoke.wav --profile-latency
ls -lh /private/tmp/talking-pets-irodori-smoke.wav
file /private/tmp/talking-pets-irodori-smoke.wav
afinfo /private/tmp/talking-pets-irodori-smoke.wav
```

確認結果:

- file size: 379K
- format: RIFF WAVE, Microsoft PCM, 16 bit, mono 48000 Hz
- duration: 4.04s

## 判断

Irodori providerはlocal server接続と基本合成が通る。

ただし初回ロードは数分かかり、client timeoutに当たりやすい。READMEやlatency caveatでは、cold startとwarm synthesisを分けて書く必要がある。

## 状態

done。
