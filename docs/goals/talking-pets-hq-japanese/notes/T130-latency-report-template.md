# T130 latency report template

## 結論

協力者がVOICEVOX/Irodoriの測定結果を出しやすいように、Platform verification issueとreal-device verification docsへRTFつき報告欄を追加した。

## 追加したこと

- Irodori欄に `Derived RTF` を追加した。
- VOICEVOX専用のlatency data欄をIssue templateへ追加した。
- `docs/real-device-verification.md` にRTFの意味を追加した。
- VOICEVOX Latency Contributionの依頼文、コマンド、記録欄を追加した。
- `docs/verification-status.md` の外部検証要件に `derived RTF if known` を足した。

## 判断

RTFを必須にはしない。協力者にはwarm synthesisとaudio durationを貼ってもらえれば、あとからこちらで計算できる。

## 状態

active。
