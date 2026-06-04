# T110 README latency snapshot

## 結論

README / README.en に、短文レイテンシのsnapshotを追加した。

## 追加した内容

- macOS `say`
- VOICEVOX speaker 3 warm synthesis
- VOICEVOX speaker 3 playback-included run
- Irodori-TTS Server warm synthesis
- Kokoro.jsはmodel cacheなしのため、downloadなしでは未測定であること

## 注意

これは性能保証ではなく、maintainer環境の測定例。

VOICEVOXの再生込み `total` は再生完了まで含むため、声が出始めるまでの値とは違う。

## 状態

done。
