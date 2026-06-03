# T030 Outreach Day 1 最新確認キュー

Owner role: 星宮 未来

## 目的

Masterが時間のある時に、最大2件だけ手動で返信できるよう、Day 1候補を最新確認前提で絞り直す。

このメモでは送信しない。自動投稿、自動DM、自動follow、自動likeはしない。

## 今日の推奨

1. OpenClaw / Sogni Voice: X public reply
2. V1GPT: Reddit public comment

どちらかの文脈が合わなければ、V1R4を予備にする。

## 1件目: OpenClaw / Sogni Voice

URL:

```text
https://x.com/krunkosaurus/status/2015719029911220531
```

現時点で近い理由:

- local TTS / STT
- OpenClaw / AI agents
- Kokoro / Qwen3-TTS / local API
- Talking Petsのlocal-first TTS routingとlatency計測に近い

送る条件:

- 投稿がlocal voice / OpenClaw / agent文脈のまま。
- 返信欄が荒れていない。
- 宣伝ではなく、latency metricの質問として自然に見える。

送らない条件:

- 投稿が古すぎて会話が止まっている。
- 返信欄が宣伝だらけ。
- repo linkを貼ると売り込みに見える。

推奨文:

```text
This is close to a small Codex companion experiment I'm building: local Codex output -> local TTS, without patching Codex.app.

I'm measuring latency now. For coding companions, which metric matters most: first audio, full utterance, or end-to-end turn time?
```

repo linkを入れる場合:

```text
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

あいちゃん判断:

- まず短い版だけが安全。
- repo linkは相手がproject/examples歓迎の空気なら追加。
- Star依頼はしない。

## 2件目: V1GPT

URL:

```text
https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/
```

現時点で近い理由:

- Codex CLI / Codex Mac App向けのvoice avatar。
- local / configurable TTS。
- 3D avatar、spoken summaries、coding companion UX。
- Talking Petsより大きい sibling project として比較しやすい。

送る条件:

- threadがコメント可能。
- creator本人またはproject文脈へ自然に返信できる。
- 「似たOSS実験として情報交換したい」という温度で送れる。

送らない条件:

- threadが閉じている。
- 既に宣伝返信が多い。
- GitHub issueに宣伝だけを投稿する形になる。

推奨文:

```text
I found V1GPT while working on a smaller Codex Pet voice experiment.

Talking Pets avoids patching Codex and uses local session output -> local TTS. I'm trying to measure when a coding avatar feels useful instead of distracting.

Would love to compare notes if that sounds relevant.
```

repo linkを入れる場合:

```text
Repo: https://github.com/arata-ai-daisuki/talking-pets
```

あいちゃん判断:

- Redditではrepo linkなしの短い版から入る方が自然。
- 相手が興味を示したらrepoを返す。
- DMはしない。

## 予備: V1R4

URL:

```text
https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/
```

使う条件:

- OpenClawまたはV1GPTが送れない。
- Claude Code側のlocal TTS / avatar / companion UXへの返信として自然。

推奨文:

```text
This feels like a close cousin to what I'm building for Codex Pet.

Talking Pets is local-first and reads Codex output into TTS, currently more lightweight than a full 3D avatar.

The thing I'm trying to measure next is when voice becomes helpful vs. too slow or too chatty. Any lessons from V1R4?
```

## Day 1送信ルール

- 最大2件。
- 1件だけでもよい。
- 迷ったら送らない。
- 初手でStar依頼しない。
- 同じ文面を連投しない。
- private contactを探さない。
- 返信がない場合、2週間催促しない。

## 送信後の記録先

```text
docs/goals/talking-pets-hq-japanese/notes/T007-outreach-tracking-template.md
```

記録するもの:

- 日付
- 相手/Project
- Surface
- URL
- 実際に送った文
- 状態
- 次アクション

## 確認した公開情報

- OpenClaw / Sogni Voice X post: `https://x.com/krunkosaurus/status/2015719029911220531`
- V1GPT Reddit post: `https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/`
- V1R4 Reddit post: `https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/`

## 状態

done。

T006のMaster判断待ちは継続。送信、DM、follow、like、PR stage、commit、pushはしていない。
