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

1. Choose the first demo link: normal README recording or X speed-ramp version.
2. Prepare one pinned X post in English and one Japanese quote post.
3. Manually verify 10 candidate accounts/projects.
4. Send 3 careful replies in the first week.
5. Add any responses or useful feedback to `implementation-notes.md` or a follow-up outreach note.
