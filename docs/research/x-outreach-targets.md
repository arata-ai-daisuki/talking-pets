# X Outreach Targets

Last updated: 2026-06-05

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

### Multilingual report form follow-up

> Thanks, this is exactly the kind of evidence I'm trying to collect carefully. I added a short report form so it does not need a full benchmark: https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/real-device-verification.md#minimal-multilingual-report-form
>
> The key thing is marking whether it is fallback-only or provider-specific evidence. Please do not attach generated audio or private logs.
>
> If your result changes a provider/runtime assumption, I will only record a short technical summary in the provider feedback intake, not private messages or contact details.

### Minimal multilingual test pack

> I added a tiny Korean/Chinese test pack so this does not need to become a full benchmark: https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/real-device-verification.md#minimal-multilingual-test-pack
>
> The useful distinction is fallback-only vs provider-specific. A sanitized routing or latency line, OS/device, provider name/version if known, and whether one spoken line was audible are enough. No generated audio or private logs needed.
>
> If you share provider-specific setup advice, I will summarize only the technical point in the provider feedback intake before changing any support wording.

### Multilingual evidence handling follow-up

> Thanks. I will record this in the multilingual evidence flow first: sanitized issue URL -> fallback-only/provider-specific classification -> provider feedback intake only if it changes runtime/cache/license/measurement/platform assumptions.
>
> I will not change README support wording from this alone unless the dedicated provider checklist is complete.

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

## Ready-To-Send Queue

These are manual send candidates only. Do not mark a row as `sent` until Master actually posts or replies and provides the public URL.

| Rank | Candidate | Use when | Template | One ask | Record after sending |
| --- | --- | --- | --- | --- | --- |
| 1 | OpenClaw / local voice builders | A current post discusses local TTS, local APIs, OpenClaw voice, or agent voice latency. | Local voice / TTS-specific | Which latency metric matters most for coding companions: first audio, full utterance, or interruption cost? | Add public URL to Search Review Log as `sent`; if technical provider advice arrives, summarize it in Provider Feedback Capture. |
| 2 | Multilingual local TTS experimenters | A public post discusses Korean, Chinese, Melo-like, Piper-like, or offline multilingual TTS setup. | Provider-specific multilingual TTS, then Minimal multilingual test pack only if they show interest. | What evidence should Talking Pets collect before claiming provider-specific support? | Add public URL, evidence type, and whether the Minimal Multilingual Report Form/Test Pack was shared. |
| 3 | Codex / voice avatar builders | A post is already about Codex, coding avatars, or voice UX for coding tools. | Codex-specific | Would voice be useful for summaries only, or normal replies too? | Add public URL and response status; do not ask for a Star in the first contact. |
| 4 | VOICEVOX / Irodori users | A current post shows local VOICEVOX/Irodori setup, latency, or user testing. | VOICEVOX / Irodori evidence ask from SNS strategy | Can they share sanitized latency or audible evidence through issue #25 or #26? | Add public URL and issue link if they open one; do not request generated audio. |

Manual send checklist:

- Pick one row and one template only.
- Confirm the post is recent and directly relevant.
- Do not ask for a Star in the first contact.
- Do not DM unless the DM Policy conditions are met.
- Do not attach generated audio, private logs, or screenshots containing local paths.
- After Master sends, update the Search Review Log as `sent` with the public URL.
- If a reply changes license, runtime, cache, measurement, or platform assumptions, add only the technical summary to Provider Feedback Capture.
- If a reply offers Korean/Chinese or other multilingual test data, send the Minimal Multilingual Report Form before changing any support wording.

## Search Review Log

Use this table before posting. A row here does not mean outreach happened; it only records a public post or project that may be relevant after manual review.

### Current Outreach Cadence Snapshot

Checked: 2026-06-05.

| Target | Current state | Public URL | Earliest follow-up | Rule |
| --- | --- | --- | --- | --- |
| OpenClaw / Sogni Voice | sent by Master | https://x.com/krunkosaurus/status/2015719029911220531 | 2026-06-17 | Do not bump unless they reply first. |
| V1GPT | sent by Master | https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/ | 2026-06-17 | Do not bump unless they reply first. |
| V1R4 | not sent | https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/ | n/a | Keep as reply-later; do not use GitHub issues as a promo surface. |
| Multilingual / local TTS candidates | watch / reply later | Search Review Log rows below | n/a | Use only when a current public thread invites evidence, setup, or benchmark discussion. |

Do not wait on the sent rows before continuing provider design, verification intake, or docs work.

### Outreach Waiting Lane Snapshot

Checked: 2026-06-05. No repo-recorded reply update is available for OpenClaw / Sogni Voice or V1GPT, so the correct action remains `wait`.

Reply watch checked: 2026-06-05. Reddit public page content for V1GPT was readable in the check and did not show a repo-recorded Talking Pets reply state. The X target page did not expose useful public HTML content to the checker, so do not infer a reply or non-reply from X alone; only record a public reply URL when Master confirms it or the public page is readable.

Later watch checked: 2026-06-05. V1GPT Reddit public HTML was readable and did not contain `Talking Pets`, `arata`, or `local session`. The OpenClaw / Sogni Voice X page still did not expose useful public HTML content to the checker. Keep both sent rows in `wait`; do not nudge before 2026-06-17 unless a public reply appears first or Master provides a public reply URL / approved private summary.

Next watch checked: 2026-06-05. V1GPT Reddit public HTML was readable and still did not expose a Talking Pets reply in the fetched page. The OpenClaw / Sogni Voice X page returned no useful public HTML lines, so the X reply state remains unknown rather than no-reply. Keep OpenClaw / V1GPT waiting; no automated outreach, manual nudge, DM, mention, follow, like, or Star ask was made.

Follow-up watch checked: 2026-06-05. V1GPT's Reddit URL now returned a verification page, so the public page did not provide readable comment evidence in this check. The OpenClaw / Sogni Voice X URL returned an app shell without usable reply text. Keep both rows in `wait`; do not infer a reply or non-reply from either page, and do not nudge before 2026-06-17 unless Master supplies a public reply URL or approved private summary.

Next-cycle watch checked: 2026-06-05. V1GPT's Reddit URL still returned a verification page, and the OpenClaw / Sogni Voice X URL still returned app-shell HTML without usable reply text. Keep both rows in `wait`; no automated outreach, manual nudge, DM, mention, follow, like, or Star ask was made.

Post-merge next-cycle watch checked: 2026-06-05. V1GPT's Reddit URL still returned a verification page, and the OpenClaw / Sogni Voice X URL still returned X logged-out app-shell HTML without usable reply text. Treat both rows as waiting with insufficient public evidence; do not infer reply or no-reply, and do not nudge before 2026-06-17 unless Master supplies a public reply URL or approved sanitized summary.

Cycle refresh checked: 2026-06-05. V1GPT's Reddit URL still returned a verification page, and the OpenClaw / Sogni Voice X URL still returned X logged-out app-shell HTML without usable reply text. Keep both sent rows in `wait`; no automated outreach, manual nudge, DM, mention, follow, like, or Star ask was made.

Cycle watch checked: 2026-06-05. V1GPT's Reddit URL still returned a verification page, and the OpenClaw / Sogni Voice X URL still returned X logged-out app-shell HTML without usable reply text. Keep both sent rows in `wait`; do not infer reply or no-reply, and do not nudge before 2026-06-17 unless Master supplies a public reply URL or approved sanitized summary.

| Target | Waiting action | Next check | Safe internal work while waiting |
| --- | --- | --- | --- |
| OpenClaw / Sogni Voice | Do not bump before 2026-06-17 unless a public reply appears first. | Record only a public reply URL or Master-approved private summary. | Provider feedback intake, local TTS approval decision, latency docs. |
| V1GPT | Do not bump before 2026-06-17 unless a public reply appears first. | Record only a public reply URL or Master-approved private summary. | Codex voice UX notes, provider comparison, verification intake. |
| V1R4 | Keep as `reply later`; use only if a current public thread invites examples. | Re-check only when preparing a new manual outreach wave. | No GitHub issue promo, no old-thread bump. |

### Reply Waiting Intake Queue

Use this queue only when a public reply arrives, or when Master approves a short private-summary record. Do not use it as a reason to send a reminder before the earliest follow-up date.

| Target | Waiting state | If they reply | Record location | Do not do |
| --- | --- | --- | --- | --- |
| OpenClaw / Sogni Voice | Sent by Master; no bump before 2026-06-17. | Classify the reply as latency, provider setup, local API, or simple acknowledgement. | Search Review Log first; Provider Feedback Capture only for technical guidance. | Do not send another nudge, ask for a Star, or copy private DM text. |
| V1GPT | Sent by Master; no bump before 2026-06-17. | Classify the reply as Codex avatar UX, latency, integration shape, or simple acknowledgement. | Search Review Log first; Provider Feedback Capture only if it changes measurement or runtime assumptions. | Do not use GitHub issues as a promo surface or ask for private logs. |
| V1R4 | Not sent; reply-later only. | Use only if a current public thread invites project examples. | Search Review Log with a fresh public URL. | Do not post to old or unrelated threads just to introduce Talking Pets. |

| Date | Query / Source | Candidate / Post | Fit | Evidence Need | Suggested Template | Decision | Follow-Up |
|---|---|---|---|---|---|---|---|
|  |  |  | Codex / local voice / multilingual TTS / AI companion | latency / provider feedback / dedicated provider evidence / intro | Codex-specific / Local voice / Provider-specific multilingual TTS / AI VTuber | watch / reply later / skip / sent |  |
| 2026-06-03 | Master manual send | OpenClaw / Sogni Voice X public reply | local voice / OpenClaw / agent voice latency | latency | Local voice / TTS-specific | sent | Public URL: https://x.com/krunkosaurus/status/2015719029911220531. Do not follow up before 2026-06-17 unless they reply first. |
| 2026-06-03 | Master manual send | V1GPT Reddit public comment | Codex / voice avatar builder | intro / latency | Codex-specific | sent | Public URL: https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/. Do not follow up before 2026-06-17 unless they reply first. |
| 2026-06-04 | `"MeloTTS" "Chinese"`, GitHub | `myshell-ai/MeloTTS` repo | multilingual TTS | provider feedback / dedicated provider evidence | Provider-specific multilingual TTS | reply later | Good fit for Chinese/Korean provider-specific evidence, but use GitHub only if discussions/issues invite integration questions. |
| 2026-06-04 | `"MeloTTS" "Chinese"`, GitHub | `apinge/MeloTTS.cpp` repo | multilingual TTS | provider feedback / dedicated provider evidence | Provider-specific multilingual TTS | watch | Chinese/OpenVINO runtime angle is relevant; wait for a public thread or issue where integration evidence is welcome. |
| 2026-06-04 | `"multilingual TTS" "offline"`, Reddit | MOSS-TTS-Nano announcement on r/LocalLLaMA | multilingual TTS | latency / provider feedback | Local voice / Provider-specific multilingual TTS | reply later | Recent project post asks for quality/latency/use-case feedback; possible place to ask what evidence a small tool should collect. |
| 2026-06-04 | `"offline TTS" "CPU"`, Reddit | Offline TTS CPU benchmark thread on r/TextToSpeech | local voice / multilingual TTS | latency / provider feedback | Local voice | reply later | Useful CPU/RTF context; ask about first-audio vs full-utterance metrics only if thread is still active. |

Review rules:

- Do not post from the table unless the current post is clearly relevant to Codex, local TTS, multilingual provider setup, AI companion UX, or explicit project examples.
- Prefer `watch` when the fit is cultural but not technical.
- Use `Provider-specific multilingual TTS` only when the person is already discussing local Korean, Chinese, or offline multilingual TTS setup.
- Record `sent` only after Master manually posts or replies.
- Do not record private contact details, private DMs, or scraped personal data.
- Do not treat unanswered outreach as blocked work; continue safe docs, provider-design, or verification-intake tasks.

### Provider Feedback Capture

When a public reply includes provider-specific guidance, add only the technical summary here first, then copy the distilled evidence into [Provider Feedback Intake](tts-provider-comparison.md#provider-feedback-intake).

Capture fields:

- public source URL, not a private profile or private DM
- provider family: `Piper`, `MeloTTS`, `sherpa-onnx`, `other`
- feedback area: `license`, `runtime`, `cache`, `measurement`, `platform`
- one-sentence technical summary
- whether it changes a stop line, design note, or next experiment

Do not paste full private messages, generated audio, private logs, email addresses, Discord handles, or contact details. If the feedback is useful but private, record only `private feedback received` plus the decision impact after Master approves the summary.

### Outreach Reply Intake Playbook

Use this only after someone replies publicly, or after Master approves a short private-summary record.

| Reply type | Record in Search Review Log | Copy to Provider Feedback Intake | Next action |
| --- | --- | --- | --- |
| Simple acknowledgement, like, or thanks | Mark as `sent` / `replied` in Follow-Up with the public URL. | No. | No follow-up unless they ask a question. |
| Latency or UX opinion | Add one-sentence summary and public URL. | Only if it changes measurement assumptions. | Consider a docs-only measurement note. |
| Provider setup guidance | Add public URL, provider family, and evidence type. | Yes, one technical sentence if it affects runtime/cache/license/measurement/platform. | Update provider design note or ask Master if it implies install/model/API work. |
| Multilingual test offer | Add public URL and mark evidence as fallback-only or provider-specific. | Only if provider assumptions change. | Send Minimal Multilingual Report Form, then route through the [Multilingual Evidence Intake Queue](../real-device-verification.md#multilingual-evidence-intake-queue); do not change README wording. |
| Private DM or unsanitized detail | Record only `private feedback received` after Master approves the summary. | Use `private summary approved by Master` only when decision impact matters. | Ask for sanitized public issue if evidence is needed. |

Do not send a follow-up before 2026-06-17 for OpenClaw / Sogni Voice or V1GPT unless they reply first.

Decision flow:

1. `watch`: relevant person or project, but the current post is not asking for tools, examples, testing, or feedback.
2. `reply later`: current post is relevant, but the message needs a concrete repo/demo/checklist link or a more specific question.
3. `skip`: the fit is weak, promotional, private, old, official-support-only, or culturally risky.
4. `sent`: Master manually posted or replied. Add the public URL and wait at least 2 weeks before any follow-up unless they reply first.

Before moving a row to `sent`, choose exactly one template and one ask:

- latency feedback
- provider feedback
- dedicated provider evidence
- intro to a relevant builder

## Candidate-Specific Manual Drafts

Use these only after the current thread/post clearly invites relevant tools, benchmarks, or implementation feedback. Keep the first touch short and public.

### `myshell-ai/MeloTTS`

> I'm building a small local-first Codex voice tool and keeping Korean/Chinese support honest for now: OS speech fallback only, not dedicated provider support. MeloTTS looks relevant for provider-specific evidence. If a project like mine wanted to evaluate it responsibly, which evidence would matter most: provider version, sample text/audio, latency lines, model/license notes, or device/OS details?

### `apinge/MeloTTS.cpp`

> This OpenVINO/C++ path is interesting for a small local-first coding companion voice tool. I'm not adding another provider yet, but I'm collecting evidence requirements first. For a lightweight integration, would you prioritize CPU latency, first-audio time, model size, language coverage, or setup complexity?

### MOSS-TTS-Nano r/LocalLLaMA post

> This is very relevant to a small local-first Codex voice add-on I'm building. I'm especially curious about what to measure for coding-companion use: first-audio latency, full utterance time, CPU load, or how distracting the voice feels during work. If you wanted feedback from small tools, what test case would be useful?

### Offline TTS CPU benchmark r/TextToSpeech post

> This benchmark is useful context. I'm measuring local TTS for a tiny Codex companion and trying not to overclaim. For real-world usability, do you think first-audio latency matters more than total generation time, or should both be reported with device/OS details?

## Sources Checked

- X search result for Mau Ledford / Sogni Voice: https://x.com/krunkosaurus/status/2015719029911220531
- X profile result for Vedal: https://x.com/vedal987
- X profile result for 紡ネン: https://x.com/tsumuginen
- Reddit V1GPT post: https://www.reddit.com/r/codex/comments/1s0avrn/i_gave_codex_a_3d_avatar_v1gpt_is_now_my_voice/
- Reddit V1R4 post: https://www.reddit.com/r/ClaudeCode/comments/1rw6296/i_gave_claude_code_a_3d_avatar_its_now_my/
- OpenClaw TTS docs: https://docs.openclaw.ai/tools/tts
- OpenClaw Voice: https://openclawvoice.com/
- Project AIRI Steam page: https://store.steampowered.com/app/3885340/Project_AIRI/
- MeloTTS GitHub: https://github.com/myshell-ai/MeloTTS
- MeloTTS.cpp GitHub: https://github.com/apinge/MeloTTS.cpp
- MOSS-TTS-Nano r/LocalLLaMA post: https://www.reddit.com/r/LocalLLaMA/comments/1sjdfp6/mossttsnano_a_01b_opensource_multilingual_tts/
- Offline TTS CPU benchmark r/TextToSpeech post: https://www.reddit.com/r/TextToSpeech/comments/1sqkiuc/benchmarked_5_offline_tts_models_on_cpu_short/
