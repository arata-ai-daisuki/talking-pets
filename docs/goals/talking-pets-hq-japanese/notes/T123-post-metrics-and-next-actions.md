# T123 post metrics and next actions

## 結論

T114のSNS投稿後に見る指標と、反応別の次アクションを用意した。

このメモではSNS投稿、DM、Issue返信、Star依頼はしない。

## 投稿後に見るタイミング

| Timing | 見るもの | 次 |
| --- | --- | --- |
| 24h | impressions / likes / reposts / replies / profile clicks / GitHub traffic if available | 反応が薄くても追撃しない |
| 72h | Issue #23-#26 comment有無、GitHub stars/watch/forksの変化 | 反応があればT120/T115で分類 |
| 7d | どの切り口に反応があったか | 次ポストの切り口を1つだけ選ぶ |

## 反応別 next action

| 反応 | 分類 | 次 |
| --- | --- | --- |
| Issueに検証報告 | verification | T120/T115でusable判定 |
| 「試したい」だけ | warm lead | 該当Issue URLを案内する返信案を作る |
| TTS provider提案 | provider research | docs/researchへ追加するか判断 |
| Anime / mascot / pet方向 | positioning | demoやREADME冒頭の見せ方を改善候補にする |
| 反応なし | no signal | 7日待ち。別切り口で1本だけ作る |

## 次ポスト候補

### A: verification call reminder

```text
Still looking for a few real-device checks for Talking Pets:

- Windows audible TTS
- Ubuntu audible TTS
- VOICEVOX latency
- Irodori latency on another CPU/GPU

Sanitized output only; no private Codex logs needed.

https://github.com/arata-ai-daisuki/talking-pets/issues
```

使う条件:

- 24h/72hで少し反応があるが、Issueコメントがまだない。

### B: latency honesty angle

```text
For Talking Pets, I'm trying to separate:

- synthesis time
- playback-included total
- first audible speech
- setup friction

The goal is not to claim "fast" too early, but to learn when a coding companion voice feels useful.
```

使う条件:

- latencyやVOICEVOX/Irodoriに反応がある。

### C: local-first privacy angle

```text
The current Talking Pets experiment stays local-first:

- no Codex.app patching
- local Codex logs
- local TTS where possible
- sanitized public evidence only

That makes it slower to prove, but easier to reason about.
```

使う条件:

- privacy / local-first / Codex extension文脈に反応がある。

## 禁止

- 初手Star依頼
- 自動DM
- 自動返信
- 反応なし相手への短期催促
- under 1s claim
- VOICEVOX/Irodoriの性能保証

## 状態

active。
