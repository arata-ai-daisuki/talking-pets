# T136 next diagnostics candidate

## 結論

次に安全に進めるなら、TTS helperの `[latency]` 行を複数回分まとめて、CSVまたはMarkdown表へ変換するdiagnostics helperがよい。

## 背景

PR #41でVOICEVOX/Irodori helperに `audioDuration` / `rtf` が出るようになった。PR #42で協力者向けdocsに出力例も入った。

次の課題は、3回以上の測定結果を人間が手で表に写すところ。

## 候補

`scripts/latency-lines-to-table.mjs` のような小さなparserを追加する。

想定入力:

```text
[latency] total=1334.3ms audio_query=120.0ms synthesis=1100.0ms audioDuration=3.861333s rtf=0.28x provider=voicevox success=true play=false
[latency] total=1388.6ms audio_query=130.0ms synthesis=1120.0ms audioDuration=3.861333s rtf=0.29x provider=voicevox success=true play=false
```

想定出力:

```markdown
| run | provider | total | synthesis | audioDuration | rtf | play |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | voicevox | 1334.3ms | 1100.0ms | 3.861333s | 0.28x | false |
| 2 | voicevox | 1388.6ms | 1120.0ms | 3.861333s | 0.29x | false |
```

## 停止線

- TTS engineを起動しない。
- model downloadしない。
- 外部APIを呼ばない。
- performance claimを強くしない。
- まずparserだけ。測定実行runnerは別Tで判断する。

## 状態

active。
