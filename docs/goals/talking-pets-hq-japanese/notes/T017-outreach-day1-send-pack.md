# T017 Outreach Day 1 送信用パック

Owner role: 星宮 未来

## 目的

Masterが時間のある時に、手動で最大2件だけ送れる状態にする。

このメモでは送信しない。自動投稿、自動DM、自動follow、自動likeもしない。

## Day 1 推奨

### 1件目: OpenClaw / Sogni Voice

Surface:

```text
X public reply
```

確認URL:

```text
https://x.com/krunkosaurus/status/2015719029911220531
```

送る前に確認:

- 投稿がlocal TTS/STT、OpenClaw、AI agentsの文脈である。
- 返信欄が荒れていない。
- 既に同じ内容を他の人が大量に返信していない。
- repoリンクを貼っても宣伝だけに見えない文脈である。

送信候補:

```text
This is close to a small Codex companion experiment I'm building: Talking Pets reads local Codex session output and routes it to local TTS without patching Codex.app.

I'm measuring latency now, so Sogni Voice/OpenClaw is a useful reference point. For coding companions, which metric feels most important: first audio, full utterance, or end-to-end turn time?

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

より短い版:

```text
This is close to a small Codex companion experiment I'm building: local Codex output -> local TTS, without patching Codex.app.

I'm measuring latency now. For coding companions, which metric matters most: first audio, full utterance, or end-to-end turn time?
```

判断:

- 送るなら短い版を優先。
- repoリンクは投稿の空気が技術共有向きなら入れる。
- Star依頼はしない。

### 2件目: V1GPT

Surface:

```text
Reddit public comment or linked public surface
```

確認URL:

```text
https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/
```

送る前に確認:

- threadがまだコメント可能である。
- creator本人またはproject文脈に返信できる。
- GitHub issueを宣伝欄として使わない。
- Xアカウントを無理に探し回らない。

送信候補:

```text
I found V1GPT while working on a similar but smaller Codex Pet experiment.

Talking Pets avoids patching Codex and uses local session output -> local TTS, with a focus on low-friction setup and latency measurement.

Would love to compare notes on what makes a coding avatar feel useful instead of distracting.

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

より短い版:

```text
I found V1GPT while working on a smaller Codex Pet voice experiment.

Talking Pets avoids patching Codex and uses local session output -> local TTS. I'm trying to measure when a coding avatar feels useful instead of distracting.

Would love to compare notes if that sounds relevant.
```

判断:

- 送るなら短い版を優先。
- repoリンクは相手がexamples/projectsを歓迎している場合だけ入れる。
- DMはしない。

## 予備: V1R4

Surface:

```text
Reddit public comment or linked public surface
```

確認URL:

```text
https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/
```

送信候補:

```text
This feels like a close cousin to what I'm building for Codex Pet.

Talking Pets is local-first and reads Codex output into TTS, currently more lightweight than a full 3D avatar.

The thing I'm trying to measure next is when voice becomes helpful vs. too slow or too chatty. Any lessons from V1R4?
```

判断:

- Day 1ではOpenClawかV1GPTが送れない時だけ使う。
- Claude Code文脈なので、Codex宣伝だけに見えないようにする。

## 送信後の記録

送ったら `T007-outreach-tracking-template.md` の送信ログへ記録する。

記録項目:

- 日付
- 相手/Project
- Surface
- URL
- 実際に送った文
- 状態: `送信済み`
- 次アクション: `2週間催促しない`

## Day 1 上限

最大2件。

1件だけでもよい。

迷ったら送らない。

## 禁止

- 自動投稿しない。
- 自動DMしない。
- 初回でStar依頼しない。
- 同じ文面を連投しない。
- private contactを集めない。
- watch-only対象へ初手で送らない。

## あいちゃん判断

Day 1は次の組み合わせが一番安全:

```text
1. OpenClaw / Sogni Voice: X public reply、短い版
2. V1GPT: Reddit public comment、短い版
```

ただし、どちらも送信直前に投稿文脈をMasterが確認する。
