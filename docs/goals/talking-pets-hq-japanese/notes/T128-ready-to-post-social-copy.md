# T128 ready to post social copy

## 結論

今すぐ手動投稿するなら、この2本を使う。

このメモではSNS投稿、DM、Issue返信、Star依頼はしない。

## English post

```text
Talking Pets has a few small verification issues open.

I'm looking for real-device checks for:

- Linux audible TTS
- Windows audible TTS
- Irodori latency on another CPU/GPU
- VOICEVOX latency on another machine

Sanitized output only. No private Codex logs needed.

https://github.com/arata-ai-daisuki/talking-pets/issues
```

## Japanese post

```text
Talking Petsの実機検証を手伝ってくれる方を募集しています。

特にほしいのは:

- Linuxで声が出るか
- Windowsで声が出るか
- Irodoriの別CPU/GPUレイテンシ
- VOICEVOXの別端末レイテンシ

privateなCodexログは不要です。
sanitize済みのcheck結果だけで助かります。

https://github.com/arata-ai-daisuki/talking-pets/issues
```

## 投稿後にT007へ貼る行

English:

```markdown
| 2026-06-04 | P0 | Contributor verification call | X public post | <投稿URL> | Talking Pets has a few small verification issues open. / Linux, Windows, Irodori, VOICEVOX verification requested. / Sanitized output only. No private Codex logs needed. | 送信済み | 24h/72h/7dでT123のmetricsを見る |
```

Japanese:

```markdown
| 2026-06-04 | P0 | Contributor verification call | X public post | <投稿URL> | Talking Petsの実機検証を手伝ってくれる方を募集しています。 / Linux、Windows、Irodori、VOICEVOXの結果が特にほしいです。 / privateなCodexログは不要です。 | 送信済み | 24h/72h/7dでT123のmetricsを見る |
```

## 投稿前チェック

- Issue #23-#26がopenである。
- READMEから各Issueへ直接行ける。
- verification-statusのExternal Verification Intakeがある。
- 初手Star依頼を入れていない。
- `fast` / `under 1s` / 性能保証を書いていない。

## 状態

active。
