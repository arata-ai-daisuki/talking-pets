# T105 say control latency baseline

## 結論

no-extra-installのcontrol sampleとして、macOS `say` の1回測定を実行した。

## 実行条件

- provider: `say`
- rollout: `test/fixtures/assistant-rollout.jsonl`
- playback: あり
- command: `npm run monitor:node -- --tts say --once --profile-latency --rollout test/fixtures/assistant-rollout.jsonl`

## 結果

```text
[latency] total=440.1ms resolveThread=0.1ms readLatestSpeechCandidate=1.0ms speechText=1.0ms speak=434.9ms candidate=true dryRun=false thread=true
```

## 判断

macOS `say` は品質や声の魅力ではIrodoriと同列ではないが、追加installなしのcontrol sampleとして有用。

Irodoriのwarm synthesis 9.6sから16.7sと比べると、OS speechは体感応答の基準線として使える。

## 次

- 同じ測定軸でVOICEVOX / voiceboxを測る。
- VOICEVOX Engineが起動していない場合は、起動作業や外部downloadを始めず、測定保留にする。

## 状態

done。
