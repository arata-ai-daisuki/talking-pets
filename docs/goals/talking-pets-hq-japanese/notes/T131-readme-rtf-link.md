# T131 README RTF link

## 結論

README / README.en のLatency snapshotに、RTFの読み方とTTS Provider Comparisonへの導線を追加した。

## 判断

README本体にはRTF表を増やさない。READMEは初見向けなので、測定値の詳細は `docs/research/tts-provider-comparison.md#maintainer-real-time-factor-snapshot` に集約する。READMEはpackageにも入るため、リンクはGitHubの絶対URLにする。

## 追加したこと

- playback-included `total` は声の出始めではない、という既存注意を維持した。
- 生成速度を見る場合は `synthesis / audio duration` のRTFを分ける、と追記した。
- VOICEVOX/IrodoriのRTF例へのリンクを日本語READMEと英語READMEに追加した。

## 状態

active。
