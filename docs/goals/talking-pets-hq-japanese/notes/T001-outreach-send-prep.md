# T001 Outreach Day-1 送信用メモ

Owner role: 星宮 未来

## 方針

これはMasterが手動で送るための準備メモです。

- 自動投稿しない。
- 自動DMしない。
- 初回でStar依頼しない。
- 相手の投稿文脈を読んでから送る。
- day-1は最大2件まで。

## 優先1: OpenClaw / Sogni Voice

確認先:

- `https://x.com/krunkosaurus/status/2015719029911220531`

送る前に見るところ:

- 投稿が今もlocal TTS/STT、OpenClaw、AI agentsの文脈か。
- 返信欄が荒れていないか。
- 相手が技術質問に反応しそうな雰囲気か。

返信案:

```text
This is close to a small Codex companion experiment I'm building: Talking Pets reads local Codex session output and routes it to local TTS without patching Codex.app.

I'm measuring latency now, so Sogni Voice/OpenClaw is a useful reference point. For coding companions, which metric feels most important: first audio, full utterance, or end-to-end turn time?

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

スパムではない理由:

- 相手の投稿がlocal voice for AI agentsの文脈。
- 技術質問が1つだけ。
- Star依頼なし。
- DMではなく公開返信。

## 優先2: V1GPT

確認先:

- `https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/`

Xアカウントが公式に紐づいていない場合:

- Xで探し回らない。
- Reddit/GitHubの公開threadだけ見る。
- GitHub issueを宣伝欄として使わない。

返信案:

```text
I found V1GPT while working on a similar but smaller Codex Pet experiment.

Talking Pets avoids patching Codex and uses local session output -> local TTS, with a focus on low-friction setup and latency measurement.

Would love to compare notes on what makes a coding avatar feel useful instead of distracting.

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

スパムではない理由:

- Codex voice/avatar UXという直接近い文脈。
- 相手の成果を先に認めている。
- 売り込みではなく比較メモの相談。

## 優先3: V1R4

確認先:

- `https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/`

返信案:

```text
This feels like a close cousin to what I'm building for Codex Pet.

Talking Pets is local-first and reads Codex output into TTS, currently more lightweight than a full 3D avatar.

The thing I'm trying to measure next is when voice becomes helpful vs. too slow or too chatty. Any lessons from V1R4?

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

スパムではない理由:

- Claude Code向けではあるが、coding companion voice/avatar UXとして近い。
- Codexの宣伝だけにしない。
- 相手の学びを聞く形。

## 日本語で紹介する場合

```text
近い方向の小さなOSS実験をしています。

Talking Petsは、Codex PetやCodexの最新応答をローカルTTSでしゃべらせるアドオンです。Codex本体は改造せず、データもローカル優先です。

いまはレイテンシ計測を始めたところで、作業中の音声UXとして「速さ」と「邪魔にならなさ」のバランスをどう見るか聞いてみたいです。

Repo: https://github.com/arata-ai-daisuki/talking-pets
```

## 送信チェックリスト

- [ ] 相手の投稿文脈に合っている。
- [ ] 初回でStar依頼していない。
- [ ] DMではない。
- [ ] 同じ文面を連投していない。
- [ ] day-1で送る件数は最大2件。
- [ ] 返信後、最低2週間は催促しない。
