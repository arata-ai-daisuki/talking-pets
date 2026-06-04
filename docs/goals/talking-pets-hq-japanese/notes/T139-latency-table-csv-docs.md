# T139 latency table CSV docs

## 結論

協力者向けVOICEVOX/Irodori測定手順に、保存済み `[latency]` 行からCSVも生成できることを追記した。

## 変更

- Irodori Latency Contributionに `npm run latency:table -- --format csv /tmp/talking-pets-irodori-latency-lines.txt` を追加した。
- VOICEVOX Latency Contributionに `npm run latency:table -- --format csv /tmp/talking-pets-voicevox-latency-lines.txt` を追加した。
- Issueへ貼る主形式はMarkdown表のままにし、CSVはメンテナのspreadsheet import用途として位置づけた。

## 状態

active。
