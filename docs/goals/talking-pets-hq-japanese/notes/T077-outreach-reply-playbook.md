# T077 outreach reply playbook

## 結論

T071で手動outreachを送った後、返信が来た場合の返答案を用意した。

このメモでは送信しない。DM、follow、like、mention、Star依頼もしない。

## 共通ルール

- 最初に短くお礼する。
- 相手の具体的な論点を1つ拾う。
- 未検証の性能claimをしない。
- 初手でStar依頼しない。
- repo linkは、相手が興味を示した時だけ出す。
- 返信がない相手には2026-06-16より前に催促しない。

## 返信パターン A: latencyに反応された

使う場面:

- first audio / full utterance / end-to-end turn time に触れてくれた。
- 「遅いと邪魔になりそう」と言われた。

返答案:

```text
Thanks, that's exactly the tradeoff I'm trying to measure.

I'm separating first audio, full utterance, and end-to-end turn time so I don't accidentally optimize the wrong thing.

Right now it's still an honest experiment, not reliably under 1s yet.
```

T007反応ログ:

```markdown
| 2026-06-02 | <相手/Project> | latency指標に反応 | はい | Thanks, that's exactly the tradeoff I'm trying to measure. / I'm separating first audio, full utterance, and end-to-end turn time so I don't accidentally optimize the wrong thing. / Right now it's still an honest experiment, not reliably under 1s yet. | Star依頼しない。under 1s claimしない。 |
```

## 返信パターン B: repoやdemoを求められた

返答案:

```text
Repo is here: https://github.com/arata-ai-daisuki/talking-pets

The current demo is intentionally small: local logs -> local TTS -> Codex Pet voice, without patching Codex.app.

I'd especially appreciate feedback on whether the voice timing feels useful or distracting.
```

T007反応ログ:

```markdown
| 2026-06-02 | <相手/Project> | repo/demoを求められた | はい | Repo is here: https://github.com/arata-ai-daisuki/talking-pets / The current demo is intentionally small: local logs -> local TTS -> Codex Pet voice, without patching Codex.app. / I'd especially appreciate feedback on whether the voice timing feels useful or distracting. | Star依頼しない。repo linkは相手が興味を示した後だけ。 |
```

## 返信パターン C: provider提案をもらった

返答案:

```text
That's useful, thank you.

For providers I'm checking three things before adding anything: local/offline path, license/credit requirements, and latency.

If you have a link to the provider docs or model terms, I'll add it to the shortlist.
```

T007反応ログ:

```markdown
| 2026-06-02 | <相手/Project> | provider提案あり | はい | That's useful, thank you. / For providers I'm checking three things before adding anything: local/offline path, license/credit requirements, and latency. / If you have a link to the provider docs or model terms, I'll add it to the shortlist. | API keyやprivate endpointを要求しない。 |
```

## 返信パターン D: AI character / avatar方向に反応された

返答案:

```text
Thanks. I'm keeping the first version deliberately narrower than a full avatar stack.

The goal is to learn when a small coding companion voice helps the workflow before adding heavier character or UI features.

That keeps the experiment local-first and easier to reason about.
```

T007反応ログ:

```markdown
| 2026-06-02 | <相手/Project> | AI character/avatar文脈に反応 | はい | Thanks. I'm keeping the first version deliberately narrower than a full avatar stack. / The goal is to learn when a small coding companion voice helps the workflow before adding heavier character or UI features. / That keeps the experiment local-first and easier to reason about. | Live2D/VRM対応済みとは書かない。 |
```

## 返信パターン E: ネガティブまたは文脈違い

返答案:

```text
Fair point, thanks for taking a look.

I'll keep the scope small and avoid overclaiming it.
```

T007反応ログ:

```markdown
| 2026-06-02 | <相手/Project> | ネガティブ/文脈違い | いいえ | Fair point, thanks for taking a look. / I'll keep the scope small and avoid overclaiming it. | 追撃しない。議論を伸ばさない。 |
```

## 状態

done。

返信、送信、DM、follow、like、mention、Star依頼はしていない。
