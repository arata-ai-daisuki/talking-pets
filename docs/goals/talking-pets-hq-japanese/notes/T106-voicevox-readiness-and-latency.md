# T106 VOICEVOX readiness and latency

## 結論

MasterがVOICEVOX / voiceboxを起動済みだったため、疎通確認と短文合成の順番測定を実行した。

追加install、model download、API key、有料API呼び出しはしていない。

## 疎通確認

```text
[latency] total=76.2ms list_voices=76.0ms provider=voicevox success=true listVoices=true
```

確認できた例:

- VOICEVOX speakers endpoint reachable
- VOICEVOX speaker list includes ずんだもん
- speaker 3: ずんだもん ノーマル
- observed speaker version: 0.16.1

## 測定条件

- provider: `voicevox`
- speaker: `3`
- text: `こんにちは。Talking Petsのウォーム測定です。`
- playback: なし
- output: `/private/tmp`
- command: `npm run tts:voicevox -- --speaker 3 --text <short-ja> --out <tmp-wav> --profile-latency`

## sequential warm synthesis 3 runs

| run | total | audio_query | synthesis | output audio |
| --- | ---: | ---: | ---: | ---: |
| 1 | 1388.6ms | 37.2ms | 1348.3ms | 3.861s |
| 2 | 2206.6ms | 52.8ms | 2148.9ms | 3.861s |
| 3 | 1334.3ms | 101.4ms | 1226.6ms | 3.861s |

Summary:

- min: 1334.3ms
- p50: 1388.6ms
- max: 2206.6ms

## ファイル確認

```text
RIFF WAVE, Microsoft PCM, 16 bit, mono 24000 Hz
estimated duration: 3.861333 sec
```

## 判断

VOICEVOXは、同じ短文ではIrodori warm synthesisよりかなり短い時間で生成できた。

ただし、これは起動済みVOICEVOX Engine上の1端末測定なので、一般化しない。READMEやSNSでは「この環境では」と書く。

## 次

- 再生込みの `--play` 測定を1回だけ追加すると、実際の体感に近づく。
- その後、Kokoroのcold/warmを同じ測定軸で確認する。

## 状態

done。
