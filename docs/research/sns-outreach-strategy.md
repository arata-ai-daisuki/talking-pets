# SNS Outreach Strategy

Talking Pets のSNS戦略メモです。

目的は、Codex / AI coding / AI VTuber / anime-style AI companion に関心がありそうな人へ、手動で丁寧に紹介することです。大量送信や自動DMではなく、相手の投稿やプロジェクトに関連がある時だけ、短い返信や紹介依頼を送ります。

## Outreach Guardrails

- 公開アカウント、公開GitHub、公開コミュニティだけを見る。
- 個人情報、非公開連絡先、private DM前提の情報は集めない。
- 同じ相手へ連投しない。
- 返信は相手の話題に関係がある時だけにする。
- "Please star" だけの投稿にしない。まずデモ、local-first、Codex非改造の価値を伝える。
- 萌え・アニメ要素は売りだが、相手の文化圏や作品を雑に扱わない。
- AI生成キャラやVTuber界隈では、アーティスト、モデル、声、規約、クレジットへの配慮を前面に置く。

## Target Segments

| Segment | Why It May Fit | First Move |
| --- | --- | --- |
| Codex / AI coding users | Talking Pets is a Codex-adjacent local add-on | Reply to Codex workflow/demo posts with a short demo |
| AI VTuber builders | anime-style AI personalities and voice interaction are central | Ask for feedback on local-first voice integration |
| Live2D / VRM tool developers | visual character + voice workflows overlap | Share demo and ask what integration point would be useful |
| TTS / VOICEVOX / local AI users | provider routing and local-first privacy are relevant | Ask for provider suggestions or language feedback |
| Tech VTubers / coding streamers | they can show the demo to developer audiences | Offer a short demo clip and repo link |
| AI agent communities | Codex local logs + voice companion is an agent UX idea | Position as a small UX experiment, not a generic chatbot |

## Outreach Candidate List

This is a starter list, not a spam list. Verify each profile manually before posting.

| Priority | Candidate | Public Surface | Why Relevant | Suggested Approach |
| --- | --- | --- | --- | --- |
| A | Fuyuki Sakura | https://sakura.live/ | Tech VTuber focused on coding, AI, game development, and VTuber tools | Reply only to relevant coding/AI/VTuber tool posts with the demo and ask for feedback |
| A | Vedal / Neuro-sama official links | https://vedal.ai/ | Major AI VTuber ecosystem; official links include X, GitHub, Discord, Reddit | Do not cold-spam. Watch for relevant AI VTuber tooling threads; one polite reply max |
| A | Open LLM Vtuber | https://docs.llmvtuber.com/en/ | Open-source voice/Live2D AI VTuber project with MCP, vision, expressions, and proactive speech | Open GitHub issue/discussion only if there is a clear integration question |
| A | Lumi | https://www.lumi.sbs/ | Open-source local anime AI VTuber project with Live2D/VRM, TTS, and no-cloud positioning | Compare local-first angle; ask whether Codex-style dev companion voice is interesting |
| B | GitHub `ai-vtuber` topic | https://github.com/topics/ai-vtuber | Many relevant repos around AI VTuber, Live2D, TTS, local LLM, companion UX | Identify active repos manually, then comment only where issues/discussions invite tools |
| B | OpenAI Codex repo/community | https://github.com/openai/codex | Talking Pets is Codex-adjacent and depends on local Codex logs | Avoid issue spam. Use discussions or personal demo posts, not support issues |
| B | Product Hunt / launch communities for Codex-like tools | https://www.producthunt.com/products/openai-codex-cli | Developer-tool audience may enjoy a playful Codex companion demo | Use as inspiration for launch wording; do not mass-comment old threads |
| C | OpenClaw / AI agent communities | https://en.wikipedia.org/wiki/OpenClaw | Agentic workflows and local/messaging AI communities may overlap | Secondary target; frame as agent UX / notification voice experiment |

## Message Templates

### English reply

```text
This is adjacent to what you're building: I made a small local-first add-on that lets Codex Pet / Codex assistant replies speak through local TTS, without patching Codex or modifying the signed app.

Demo: <link>
Repo: <link>

Would love feedback from people building AI character / dev-tool workflows.
```

### Short English reply

```text
Tiny Codex + anime/dev-companion experiment: local logs -> local TTS -> speaking Codex Pet. No Codex patching.
Demo/repo: <link>
Curious if this kind of AI dev companion UX resonates with you.
```

### Japanese reply

```text
近いテーマだったので共有です。
Codex本体を改造せず、ローカルログを読んでCodex Pet / assistant発話をローカルTTSで喋らせる小さなアドオンを作っています。

デモ: <link>
Repo: <link>

AIキャラ / 開発支援 / VTuberツール文脈でフィードバックもらえたら嬉しいです。
```

### Introduction ask

```text
I'm looking for developers who enjoy AI coding tools, local-first TTS, or anime-style AI companions. If you know someone who might find this fun, I'd appreciate an intro.

It's a small open-source Codex companion experiment, not a commercial pitch.
```

### Verification help ask

```text
I'm collecting real-device data for Talking Pets, especially local TTS latency and Windows/Linux audible TTS checks.

If you have a local VOICEVOX, Irodori, Windows, or Linux setup, a sanitized GitHub verification issue would help a lot:
https://github.com/arata-ai-daisuki/talking-pets/issues/new?template=platform_verification.yml

No generated audio files needed. Just sanitized command output and whether one spoken line was audible.
```

### VOICEVOX / Irodori evidence ask

```text
I'm collecting a few more real-device reference results for Talking Pets local TTS.

The most useful data right now is:
- VOICEVOX latency on another machine
- Irodori-TTS Server latency on another CPU/GPU/backend

If you already have either running locally, sanitized latency lines in a GitHub Platform verification issue would help:
https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/real-device-verification.md#voicevox-latency-contribution

No generated audio files or private logs needed. Device/OS, provider version if known, warm synthesis times, audio duration/RTF if available, and whether one spoken line was audible are enough.
```

### Dedicated provider evidence ask

```text
I'm also separating OS speech fallback from dedicated provider evidence for Korean/Chinese or other multilingual TTS.

If you have a provider-specific local TTS path for those languages, a sanitized Platform verification issue would be very helpful:
https://github.com/arata-ai-daisuki/talking-pets/issues/new?template=platform_verification.yml

Useful details: source text or fixture, forced/detected speech-language value, provider name/version, OS/device, config source, whether one spoken line was audible, and sanitized `[latency]` lines if measured.

No generated audio files, private Codex text, credentials, or local private paths needed.
Checklist: https://github.com/arata-ai-daisuki/talking-pets/blob/main/docs/verification-status.md#dedicated-provider-evidence-checklist
```

### After someone shows interest

```text
Thank you! The cleanest way to share results is this GitHub "Platform verification" issue template:
https://github.com/arata-ai-daisuki/talking-pets/issues/new?template=platform_verification.yml

Useful reports include OS/device, Node/npm versions, TTS path, speech-language value, sanitized `[latency]` lines if measured, and whether one spoken line was audible.

For Korean/Chinese tests, please mark whether it was OS speech fallback or a dedicated provider so I don't overclaim multilingual support.
```

### Provider feedback ask

```text
I'm comparing local multilingual TTS candidates for Talking Pets, but I'm intentionally not adding a new dependency or model download yet.

Current notes:
- Piper looks license-sensitive because the current maintained repo is GPL-3.0 while older Piper sources were MIT.
- MeloTTS looks runtime-sensitive because the public install path is Python/Docker oriented.

If you have used either one, what would you verify before integrating it into a small local-first tool: voice/model license, install size, cache path, CLI/server boundary, or latency measurement?

No generated audio or install test needed for this question; I'm just looking for integration/packaging advice.
```

## Suggested Weekly Rhythm

- Pick 3 to 5 relevant posts or projects.
- Send at most 1 thoughtful reply per person/project.
- Record outcome: no response / liked / replied / starred / suggested follow-up.
- If someone engages, ask one concrete question instead of immediately asking for promotion.
- If no one engages, adjust demo copy before increasing volume.

## Tracking Table

| Date | Target | Surface | Message Type | Outcome | Follow-Up |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## Next Actions

1. Pick one row from [Ready-To-Send Queue](x-outreach-targets.md#ready-to-send-queue), not a broad target segment.
2. Confirm the current post is recent and directly relevant before replying.
3. Use exactly one ask: latency feedback, provider feedback, dedicated provider evidence, or intro to a relevant builder.
4. Send manually; do not automate replies, DMs, follows, likes, or mentions.
5. After sending, add the public URL to [Search Review Log](x-outreach-targets.md#search-review-log) as `sent`.
6. If someone offers verification help, send the "After someone shows interest" template and ask them to use a sanitized Platform verification issue.
7. When asking TTS/provider experts, use the "Provider feedback ask" template and record whether the answer affects license, runtime, cache, or measurement planning.
8. When someone can test Korean/Chinese with a provider-specific local TTS path, use the "Dedicated provider evidence ask" template and the checklist link.
9. Do not wait on replies before continuing safe internal work; unanswered outreach is a watch state, not a blocker.

### Current Outreach Watch Cadence

Checked: 2026-06-05. OpenClaw / Sogni Voice and V1GPT are already marked as Master-sent in the Search Review Log. Do not send another nudge before 2026-06-17 unless they reply first.

Use the waiting period for safe internal work:

- provider design notes
- verification intake docs
- multilingual evidence handling
- README/SNS route clarity

If OpenClaw / Sogni Voice or V1GPT replies before 2026-06-17, record the public URL in the [Reply Waiting Intake Queue](x-outreach-targets.md#reply-waiting-intake-queue) first. Copy only technical impact into Provider Feedback Capture; do not paste private DM text, ask for a Star, or turn the reply into another outreach push.

The current wait-state is tracked in the [Outreach Waiting Lane Snapshot](x-outreach-targets.md#outreach-waiting-lane-snapshot). Treat unanswered outreach as watch state, not a blocker.

Later watch: 2026-06-05. V1GPT's public Reddit page was readable and did not expose a Talking Pets reply in the fetched HTML. The OpenClaw / Sogni Voice X page did not expose useful public HTML content, so do not infer reply state from X. Keep both rows as waiting and do not nudge before 2026-06-17 unless a public reply appears first.

Next watch: 2026-06-05. V1GPT remains readable via public Reddit HTML, with no Talking Pets reply visible in the fetched page. The OpenClaw / Sogni Voice X page still does not expose useful public HTML lines. Treat both as waiting and continue safe internal work; do not send or nudge.

Follow-up watch: 2026-06-05. V1GPT's Reddit URL returned a verification page in the latest check, and the OpenClaw / Sogni Voice X URL returned only app-shell HTML. Treat both as waiting with insufficient public evidence, not as confirmed no-reply. Do not send, nudge, DM, mention, follow, like, or ask for a Star before 2026-06-17 unless a public reply appears first or Master provides an approved summary.

Next-cycle watch: 2026-06-05. V1GPT still returns a Reddit verification page and OpenClaw / Sogni Voice still returns X app-shell HTML in the public fetch. Treat both as waiting with insufficient public evidence, not as confirmed no-reply. Continue safe internal work; do not send or nudge.

Post-merge next-cycle watch: 2026-06-05. V1GPT still returns a Reddit verification page and OpenClaw / Sogni Voice still returns X logged-out app-shell HTML in the public fetch. Keep the outreach lane in wait state with insufficient public evidence; do not send, nudge, DM, mention, follow, like, or ask for a Star before 2026-06-17 unless a public reply appears first or Master provides an approved sanitized summary.

Cycle refresh watch: 2026-06-05. V1GPT still returns a Reddit verification page and OpenClaw / Sogni Voice still returns X logged-out app-shell HTML in the public fetch. Keep the outreach lane in wait state; do not send, nudge, DM, mention, follow, like, or ask for a Star before 2026-06-17 unless a public reply appears first or Master provides an approved sanitized summary.

Cycle watch: 2026-06-05. V1GPT still returns a Reddit verification page and OpenClaw / Sogni Voice still returns X logged-out app-shell HTML in the public fetch. Keep the outreach lane in wait state; do not infer reply/no-reply from unreadable public pages, and do not send, nudge, DM, mention, follow, like, or ask for a Star before 2026-06-17 unless a public reply appears first or Master provides an approved sanitized summary.

Boundary watch: 2026-06-05. V1GPT still returns a Reddit verification page, and OpenClaw / Sogni Voice still returns X logged-out app-shell HTML in the public fetch. Keep the outreach lane in wait state with insufficient public evidence; no send, nudge, DM, mention, follow, like, or Star ask was made.

Boundary watch 2: 2026-06-05. V1GPT still returns a Reddit verification page, and OpenClaw / Sogni Voice still returns X logged-out app-shell HTML in the public fetch. Keep the outreach lane in wait state with insufficient public evidence; no send, nudge, DM, mention, follow, like, or Star ask was made.

Keep V1R4 as `reply later` until a current public thread clearly invites related project examples.

### Public Proof Route Selector

Checked: 2026-06-05. Use this selector when the next step is public visibility but current outreach and verification issues are still waiting.

Recommended route: **A: polish the public proof hub**.

| Route | Next small PR | Why choose it now | Stop line |
| --- | --- | --- | --- |
| A: public proof hub polish | Make README/SNS/verification links easier to follow without changing support claims. | It improves trust for new visitors and future outreach while Issues #23-#26 and OpenClaw/V1GPT are waiting. | Do not claim Windows/Linux stable, broader TTS performance, or dedicated Korean/Chinese provider support. |
| B: verification watch only | Re-check Issues #23-#26 and update watch snapshots only if public evidence appears. | Useful on a cadence, but not enough to improve the first-visitor path when there are still 0 comments. | Do not nudge issues automatically. |
| C: outreach waiting lane only | Keep OpenClaw/V1GPT wait state current and intake replies if they arrive. | Safe but mostly reactive until 2026-06-17. | Do not send another nudge before 2026-06-17 unless there is a public reply first. |
| D: provider feedback capture | Prepare provider-feedback intake if someone replies with runtime/cache/license guidance. | Good follow-up path, but currently no new feedback is recorded. | Do not turn provider feedback into implementation approval. |

Default next action: choose A and improve the proof hub/navigation. It is docs-only, does not depend on external replies, and keeps all public claims inside the existing evidence boundaries.
