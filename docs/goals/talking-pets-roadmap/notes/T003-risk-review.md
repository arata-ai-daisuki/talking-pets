# T003 Risk Review Receipt

## Result

done

## Decision

not_complete

## Rationale

The roadmap operating model is valid, but completion is not yet approved because the Master has not reviewed the roadmap draft or chosen the next PR sequence.

## Required Guardrails

- Local-first default: API TTS, external LLM summarizers, and paid services stay off unless explicitly enabled.
- No paid API by default: do not run paid API-style paths without same-turn Master approval.
- Privacy checkpoint: Codex logs, rollout JSONL, `state_5.sqlite`, generated audio, API keys, and credentials must not be pasted into public issues or releases.
- Provider terms checkpoint: verify VOICEVOX, Kokoro, provider, voice-library, and SNS publication terms before public claims.
- Public claim discipline: only verified OS/language/provider paths are called Stable; unverified paths remain Experimental or fallback.
- Small PR rule: each PR needs one purpose, a proof command, and a rollback path.
- No overengineering: provider abstraction and settings UI should stay thin until there is clear repeated need.
- Master confirmation gate: billing, privacy, public positioning, release timing, and scope expansion require Master confirmation.
