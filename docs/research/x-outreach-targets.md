# X Outreach Targets

Last updated: 2026-06-02

This is a manual outreach list for Talking Pets. Do not automate replies, DMs, follows, likes, or mentions from this list.

## Rules

- Reply only when the post is already about Codex, coding companions, AI avatars, local TTS, AI VTubers, or local-first agent UX.
- Prefer one useful reply over a broad mention campaign.
- Do not ask for a star in the first message.
- Do not DM unless the person explicitly invites DMs, asks for projects/examples, or follows/replies first.
- Do not collect private contact details. Use public posts, public profiles, GitHub, Reddit, and official project pages only.
- For anime/moe/VTuber culture, be respectful and specific. Avoid using the vibe as a gimmick.

## Priority Targets

| Priority | Target | Why it fits | Best channel | Reply or DM | Suggested message |
|---|---|---|---|---|---|
| P0 | Mau Ledford / OpenClaw voice ecosystem, `@krunkosaurus` | Posted about open-sourcing Sogni Voice for OpenClaw and other AI agents, with low-latency local TTS/STT, Kokoro, Qwen3-TTS, and local APIs. Strong overlap with local-first voice agents. | X reply to local TTS / Sogni Voice / OpenClaw voice posts | Reply first. DM only after reply/follow-up. | "This is very close to the direction I'm exploring: a local-first voice layer for Codex Pet. Talking Pets reads local Codex session output and routes it to local TTS without patching the app. I just added latency profiling, so your local voice stack is a useful reference point. Curious what latency metric you think matters most for coding companions: first audio, full utterance, or end-to-end turn time?" |
| P0 | V1GPT creator, `intarm` on GitHub / r/codex post | Built a voice avatar layer for Codex CLI and Codex Mac App. This is the closest direct sibling project. X account was not confirmed from public search, so start from Reddit/GitHub unless an official X link is found. | Reddit/GitHub first; X only if public account is linked by the creator | Reply/comment first. Avoid cold DM. | "I found V1GPT while working on a similar but smaller Codex Pet experiment. Talking Pets avoids patching Codex and uses local session logs -> local TTS, with a focus on low-friction setup and latency measurement. Would love to compare notes on what makes a coding avatar feel useful instead of distracting." |
| P0 | V1R4 creator, `Kunnatam` on GitHub / r/ClaudeCode post | Built a 3D avatar that reads Claude Code responses aloud with local TTS. Adjacent to Talking Pets even though the host tool is Claude Code. | Reddit/GitHub first; X only if public account is linked by the creator | Reply/comment first. Avoid cold DM. | "This is a close cousin to what I'm building for Codex Pet. Talking Pets is local-first and reads Codex local output into TTS, currently more lightweight than full 3D avatar. The thing I'm trying to measure next is when voice becomes helpful vs. too slow or too chatty. Any lessons from V1R4?" |
| P1 | OpenAI Codex community / Codex-related builders | Codex users are the core audience. Search for posts about Codex CLI, Codex Mac App, pets, local workflows, or voice UX. | X replies, GitHub Discussions, Reddit r/codex | Reply. Do not DM. | "Small Codex UX experiment: I made Talking Pets, a local add-on that lets Codex Pet speak recent assistant output through local TTS. It does not patch Codex.app and keeps the data local. I'm measuring latency now; feedback from people who use Codex daily would be really helpful." |
| P1 | OpenClaw / local voice builders | OpenClaw docs and community are already voice/TTS-heavy, including local CLI and self-hosted voice stacks. Good for technical feedback on latency and provider routing. | X replies to OpenClaw voice posts; Reddit r/openclaw | Reply. DM only after public interaction. | "This local voice stack is useful context for Talking Pets. Mine is narrower: Codex companion voice rather than chat-app voice messages. I'm trying to keep it local-first and simple. Do you think local CLI TTS or an OpenAI-compatible local API is the better integration path for small tools?" |
| P1 | Project AIRI / Moeru AI | AIRI is an open-source, self-hosted AI companion with VRM/Live2D, voice chat, and screen/game awareness. Strong anime companion overlap. | X if an official project account/post is available; GitHub/Discord only where appropriate | Reply to relevant dev posts. Avoid cold DM. | "AIRI's self-hosted AI companion direction is very aligned with a tiny tool I'm building: Talking Pets, a Codex Pet voice add-on. It is not a full companion platform, but it explores developer-tool companionship with local TTS. The interesting question for me is: how much personality helps during coding before it becomes noise?" |
| P1 | Open-LLM-VTuber | Open-source AI VTuber project with voice/Live2D/local companion overlap. | X if linked from official project; GitHub Discussions/Issues only for relevant topics | Reply to relevant posts. No drive-by issues. | "Open-LLM-VTuber is much fuller-featured, but I think the dev-tool angle is adjacent. Talking Pets is a small Codex Pet voice layer using local logs and local TTS. If you have thoughts on voice timing or personality settings for work contexts, I'd love to learn from them." |
| P2 | Lumi, `Lumisbs/Lumi` | Local/no-cloud AI VTuber / desktop companion angle. Good cultural fit, but not Codex-specific. | X/GitHub only when local AI VTuber or no-cloud voice posts appear | Reply. Avoid DM. | "The local/no-cloud AI VTuber direction overlaps with a small Codex experiment I'm building. Talking Pets is much narrower: local Codex output -> local TTS for a coding companion. It might be interesting as a developer-tool use case for local character voice UX." |
| P2 | Fuyuki Sakura | AI/VTuber/dev culture intersection. Better as a careful, low-frequency outreach target. | X replies only when the post is about AI coding, VTuber tools, or dev workflows | Reply only. No cold DM. | "This AI + VTuber tool angle reminded me of a small OSS experiment I'm building: Talking Pets makes Codex Pet speak through local TTS. Not a full VTuber stack, but I'm trying to bring a little character presence into coding tools without sending data to cloud TTS." |
| P2 | VOICEVOX community / VOICEVOX users | Talking Pets has optional VOICEVOX routing and credits. Useful for Japanese TTS users, but official channels should not be used as a promo surface. | User posts about VOICEVOX integrations, not official support threads | Reply only when they ask for examples/tools | "I'm using VOICEVOX as an optional local provider in a small Codex Pet voice tool. I kept it opt-in and documented credits/usage notes. If you're collecting examples of developer tools using VOICEVOX locally, Talking Pets might be a tiny one." |
| P2 | Multilingual local TTS experimenters | People testing Korean, Chinese, Piper-like, Melo-like, or other offline multilingual TTS can provide provider-specific evidence without broad promo. | X/GitHub/Reddit posts about local multilingual TTS benchmarks or setup notes | Reply only when they discuss provider setup or ask for tests/examples | "I'm collecting sanitized real-device evidence for a small local-first Codex voice tool. Korean/Chinese are currently OS speech fallback only, so I'm trying not to overclaim. If you have a provider-specific local TTS path for those languages, what evidence would you want a project to collect before calling it supported?" |
| Watch only | Vedal / Neuro-sama ecosystem | Huge AI VTuber audience and technically relevant, but high risk of cold-mention noise. | Observe only at first | No DM. Avoid cold mention. | No first-touch message. Only engage if a thread explicitly asks for small open-source AI avatar/dev-tool examples. |
| Watch only | 紡ネン / AI VTuber official accounts | AI VTuber concept fit, but official/character accounts are not good first-touch technical feedback channels. | Observe only | No DM. Avoid cold mention. | No first-touch message. |

## Search Queries For Manual Review

Use these on X before sending anything:

- `"Codex" "avatar"`
- `"Codex" "TTS"`
- `"Codex CLI" "voice"`
- `"Claude Code" "avatar" "local TTS"`
- `"local TTS" "AI agents"`
- `"Kokoro" "TTS" "agent"`
- `"VOICEVOX" "AI agent"`
- `"Korean" "local TTS"`
- `"Chinese" "local TTS"`
- `"multilingual TTS" "offline"`
- `"Piper" "Korean" "TTS"`
- `"MeloTTS" "Chinese"`
- `"AI VTuber" "open source"`
- `"VRM" "AI companion"`
- `"Live2D" "AI companion"`

## Reply Templates

### Codex-specific

> I'm working on a small adjacent experiment: Talking Pets lets Codex Pet speak recent assistant output through local TTS, without patching Codex.app. I'm measuring latency now. For your workflow, would voice be useful only for summaries, or also for normal assistant replies?

### Local voice / TTS-specific

> This local voice direction is very relevant to a tiny tool I'm building. Talking Pets is narrower: local Codex output -> local TTS for a coding companion. I'm trying to decide whether the key metric should be first-audio latency, full-utterance latency, or perceived interruption cost.

### Provider-specific multilingual TTS

> I'm collecting careful evidence for a small local-first Codex voice tool. Korean/Chinese are currently OS speech fallback only, not dedicated provider support. If you have a provider-specific local TTS setup for those languages, what would you want to see before a project claims support: provider version, source text, audible result, latency lines, model/license notes, or OS/device details?

### AI VTuber / companion-specific

> I like this AI companion direction. I'm exploring a developer-tool version: a local-first Codex Pet voice add-on, more "coding companion" than full VTuber stack. The hard part seems to be balancing charm with not interrupting the work.

### Japanese

> 近い方向の小さなOSS実験をしています。Talking Petsは、Codex Petの吹き出し/最新応答をローカルTTSでしゃべらせるアドオンです。Codex本体は改造せず、データもローカル優先です。いまはレイテンシ計測を始めたところで、作業中の音声UXとしてどこが気になるか聞いてみたいです。

## DM Policy

Do not send DMs as first contact unless one of these is true:

- The person explicitly says "DM me examples/projects".
- They ask for feedback links and DMs are the requested channel.
- They replied positively to a public reply first.
- They follow the project or the maintainer first.

If DM becomes appropriate:

> Hi, thanks for the reply. Sharing the repo here so I don't derail the thread: Talking Pets is a local-first Codex Pet voice add-on. I'm mainly looking for feedback on latency and whether the voice should read full replies or only short summaries. No pressure to try it if it's not relevant.

## First Week Plan

1. Review the latest public posts from `@krunkosaurus` / OpenClaw voice first.
2. Check whether V1GPT or V1R4 creators link public X accounts from GitHub/Reddit.
3. Send at most 2 replies total on day 1.
4. Track each contact manually:
   - date
   - target
   - link to post
   - message used
   - response
   - follow-up needed
5. If no response, do not bump the same person for at least 2 weeks.

## Sources Checked

- X search result for Mau Ledford / Sogni Voice: https://x.com/krunkosaurus/status/2015719029911220531
- X profile result for Vedal: https://x.com/vedal987
- X profile result for 紡ネン: https://x.com/tsumuginen
- Reddit V1GPT post: https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/
- Reddit V1R4 post: https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/
- OpenClaw TTS docs: https://docs.openclaw.ai/tools/tts
- OpenClaw Voice: https://openclawvoice.com/
- Project AIRI Steam page: https://store.steampowered.com/app/3885340/Project_AIRI/
