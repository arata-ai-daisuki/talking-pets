# T127 issue comment drafts

## 結論

READMEからIssue #23-#26へ直接来た人向けに、短い補足コメント案を用意した。

このメモではIssueコメントを投稿しない。投稿する場合はMaster確認後に手動で行う。

## 判断

今すぐ全Issueへコメントを足す必要はない。

理由:

- Issue本文には、実行コマンド、報告項目、安全ルールがすでにある。
- 直リンクから来た人向けの補足は有用だが、コメント0件のIssueにmaintainerコメントを増やすと少し重く見える可能性もある。
- SNS投稿後に「どれを貼ればいい？」という反応が出た時だけ、該当Issueへ補足コメントを足すのがよい。

## 共通コメント案

```markdown
If you came here from the README or an SNS post, a short report is enough.

Please include:

- OS/device summary
- the command you ran
- TTS path tested
- whether one spoken line was audible
- sanitized output only

No private Codex logs or generated audio are needed.
```

## #23 Linux向け短縮コメント

```markdown
For Linux reports, the most useful extra detail is which audio path worked: `espeak`, `aplay`, `paplay`, `ffplay`, VOICEVOX, Kokoro, or another local TTS path.
```

## #24 Windows向け短縮コメント

```markdown
For Windows reports, the most useful extra detail is which TTS path worked: Windows System.Speech, VOICEVOX, Kokoro, or another local TTS path.
```

## #25 Irodori向け短縮コメント

```markdown
For Irodori latency reports, please separate cold start, warm synthesis, playback-included total, and generated audio duration if possible.
```

## #26 VOICEVOX向け短縮コメント

```markdown
For VOICEVOX latency reports, please include speaker id/name and whether each timing includes playback completion.
```

## 投稿する条件

- SNS投稿後に、Issueへ来た人が迷っている。
- Issueコメントで情報不足が起きた。
- Masterが「補足コメント入れて」と明示した。

## 投稿しない条件

- Issueにまだ反応がない。
- 単に見栄えを整えたいだけ。
- 同じ補足を4Issueへ機械的に貼るだけ。

## 状態

active。
