# T138 latency table docs

## 結論

協力者向けVOICEVOX/Irodori測定手順に、保存済み `[latency]` 行を `npm run latency:table` でMarkdown表へ変換する手順を追加した。

## 変更

- Irodori Latency Contributionに `npm run latency:table -- /tmp/talking-pets-irodori-latency-lines.txt` を追加した。
- VOICEVOX Latency Contributionに `npm run latency:table -- /tmp/talking-pets-voicevox-latency-lines.txt` を追加した。
- 生成WAVではなくsanitized `[latency]` 行と生成Markdown表をIssueへ貼る流れにした。

## 状態

active。
