# T114 contributor call copy pack

## 結論

Issue #23-#26 を使って、外部協力者を募集するSNS文面を用意した。

このメモでは投稿しない。自動投稿、自動DM、follow、like、mention代行はしない。

## 使うIssue

- Windows: https://github.com/arata-ai-daisuki/talking-pets/issues/24
- Linux: https://github.com/arata-ai-daisuki/talking-pets/issues/23
- Irodori latency: https://github.com/arata-ai-daisuki/talking-pets/issues/25
- VOICEVOX latency: https://github.com/arata-ai-daisuki/talking-pets/issues/26

## English post

```text
Talking Pets now has a few small help-wanted issues.

I'm looking for real-device reports, especially:

- Windows 11 audible TTS
- Ubuntu 24.04 audible TTS
- VOICEVOX latency on another machine
- Irodori latency on another CPU/GPU

No private Codex logs needed. Sanitized check output is enough.

https://github.com/arata-ai-daisuki/talking-pets/issues
```

## English reply-sized version

```text
I opened a few small verification issues for Talking Pets:

- Windows / Linux audible TTS
- VOICEVOX latency
- Irodori latency on another CPU/GPU

Sanitized output only, no private Codex logs.

https://github.com/arata-ai-daisuki/talking-pets/issues
```

## Japanese quote post

```text
Talking Pets、協力者募集Issueを作りました。

特にほしいのは:

- Windows 11で声が出るか
- Ubuntu 24.04で声が出るか
- VOICEVOXの別端末レイテンシ
- Irodoriの別CPU/GPUレイテンシ

privateなCodexログは不要です。
sanitize済みのcheck結果だけで助かります。

https://github.com/arata-ai-daisuki/talking-pets/issues
```

## Japanese shorter version

```text
Talking Petsの実機検証を手伝ってくれる方を募集しています。

Windows / Linux / VOICEVOX / Irodori あたりの結果が特にほしいです。

privateなCodexログは不要で、sanitize済みのcheck結果だけでOKです。

https://github.com/arata-ai-daisuki/talking-pets/issues
```

## 投稿後にT007へ貼る行

```markdown
| 2026-06-04 | P0 | Contributor verification call | X public post | <投稿URL> | Talking Pets now has a few small help-wanted issues. / Windows, Linux, VOICEVOX, Irodori verification requested. / No private Codex logs needed. | 送信済み | 反応があればIssueへ誘導。催促しない。 |
```

## 注意

- 初手でStar依頼しない。
- "fast" や "under 1s" と言わない。
- VOICEVOX/Irodoriの結果を性能保証として書かない。
- 反応が来たら、相手の環境に合うIssueへ誘導する。
- private path、conversation text、rollout JSONL、generated audioは貼らないよう案内する。

## 状態

done。
