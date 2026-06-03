# T056 outreach day1 post-merge send pack

## 結論

PR #8 merge後の Day 1 outreach は、手動送信できる状態。

ただし、送信はMasterが手で行う。あいちゃんは自動投稿、自動DM、自動follow、自動like、mention爆撃をしない。

## 現在の公開状態

| item | value |
| --- | --- |
| Repo | `https://github.com/arata-ai-daisuki/talking-pets` |
| PR #8 | `MERGED` |
| merge commit | `f12b2a191e65f34958b1516f1e70fba3278e5003` |
| latest saved wave | roadmap / GoalBuddy receipts / outreach notes |
| latency diagnostics | PR #6 merged |
| multilingual docs/fixtures | PR #7 merged |

## Day 1 方針

最大2件だけ送る。

優先順:

1. V1GPT Reddit public comment
2. OpenClaw / Sogni Voice X public reply

OpenClaw側の投稿文脈が合わない場合だけ、V1R4 Reddit public commentに差し替える。

## 1件目: V1GPT

Surface:

```text
Reddit public comment
```

URL:

```text
https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/
```

送る文:

```text
I found V1GPT while working on a smaller Codex Pet voice experiment.

Talking Pets avoids patching Codex and uses local session output -> local TTS. I'm trying to measure when a coding avatar feels useful instead of distracting.

Would love to compare notes if that sounds relevant.
```

初手ではrepo linkを入れない。

相手が興味を示したら返す:

```text
Repo is here: https://github.com/arata-ai-daisuki/talking-pets
```

## 2件目: OpenClaw / Sogni Voice

Surface:

```text
X public reply
```

URL:

```text
https://x.com/krunkosaurus/status/2015719029911220531
```

送る前に手で確認:

- 投稿本文が local voice / OpenClaw / agent / TTS 文脈のままか。
- 返信欄が荒れていないか。
- repo linkなしの質問として自然に見えるか。

送る文:

```text
This is close to a small Codex companion experiment I'm building: local Codex output -> local TTS, without patching Codex.app.

I'm measuring latency now. For coding companions, which metric matters most: first audio, full utterance, or end-to-end turn time?
```

repo linkは、相手がexamples歓迎の空気なら追加:

```text
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

## 予備: V1R4

Surface:

```text
Reddit public comment
```

URL:

```text
https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/
```

送る文:

```text
This feels like a close cousin to what I'm building for Codex Pet.

Talking Pets is local-first and reads Codex output into TTS, currently more lightweight than a full 3D avatar.

The thing I'm trying to measure next is when voice becomes helpful vs. too slow or too chatty. Any lessons from V1R4?
```

## 送信前の一言チェック

送る直前に、Masterがこれだけ確認する。

```text
これは相手の今の投稿文脈に返して自然か？
```

自然でなければ送らない。

## 送信後の記録

送ったらこのテンプレへ追記する。

```text
docs/goals/talking-pets-hq-japanese/notes/T007-outreach-tracking-template.md
```

最低限:

- 日付
- 相手 / Project
- URL
- 実際に送った文
- 状態
- 次に触ってよい日

## 禁止

- 自動投稿しない。
- 自動DMしない。
- 自動follow / like / mentionしない。
- 初手でStar依頼しない。
- 同じ文面を連投しない。
- private contactを探さない。
- 返信がない場合、2週間催促しない。

## 状態

done。

送信、DM、follow、like、mention、Star依頼はしていない。
