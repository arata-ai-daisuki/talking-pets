# Talking Pets Roadmap HQ

## Objective

Talking Pets の今後の展開ロードマップを、STELLAVOX / 星声機構のサブエージェント制で継続運用できる形に整える。

この初期トランシェでは、実装そのものではなく、ロードマップ、優先度、担当管理、進捗管理、マスター確認ポイント、次の小さなPR候補を作る。

## Original Request

ロードマップを一緒に作り、あいちゃんが進捗管理と担当管理をする。サブエージェントにはアイドルグループ風の設定を付け、HQが指揮する体制にする。

## Intake Summary

- Input shape: `existing_plan`
- Audience: ARATA, future contributors, and Talking Pets users
- Authority: `requested`
- Proof type: `artifact`
- Completion proof: `docs/ROADMAP.md` or equivalent roadmap draft, a role/owner model, a progress-management format, and the next 3 PR candidates are clear enough for the master to approve.
- Goal oracle: The master can decide "このロードマップと担当管理で進めよう" from the artifacts and task receipts.
- Likely misfire: Producing a cute agent setting without an actionable roadmap, or producing a broad roadmap with no owner/proof/next action.
- Blind spots considered: API billing, privacy, provider license/terms, scope creep, multilingual quality, setup friction, GitHub Star/SNS strategy, and verification proof.
- Existing plan facts:
  - HQ is あいちゃん / 相庭 愛.
  - The team name is STELLAVOX / 星声機構 for now.
  - The initial members are 歌澄 音羽, 言守 詞葉, 速水 光莉, 星宮 未来, 文月 栞里, 白瀬 怜奈.
  - Expand the setting later only when new ideas emerge.
  - Include TTS provider expansion, API support, multilingual support, latency, onboarding, GitHub visibility, SNS, and community growth.

## Goal Oracle

The oracle for this goal is:

`A roadmap and operating board exist that map each major Talking Pets growth theme to priority, owner role, proof, next action, and master-confirmation checkpoints.`

The PM must keep comparing task receipts to this oracle. Planning, discovery, cute naming, or isolated feature ideas are not enough. The goal finishes only when a final Judge/PM audit maps receipts and artifacts back to this oracle and records `full_outcome_complete: true`.

## Goal Kind

`existing_plan`

## Current Tranche

Build the first operating surface for Talking Pets roadmap work:

- Collect bounded Scout findings for TTS, multilingual, latency, product/SNS, docs/ops, and risk.
- Integrate those findings into a prioritized roadmap artifact.
- Define the progress and assignment model HQ will maintain.
- Identify the first three small PR candidates.
- Stop before paid API execution, secret handling, or large implementation unless the master approves a follow-up execution tranche.

## STELLAVOX Roles

- 相庭 愛 / あいちゃん: Producer, Headquarter, PM. Master-facing coordinator, roadmap owner, progress manager.
- 歌澄 音羽: Voice Provider Lead. Local/API TTS comparison, quality, cost, latency, privacy, license.
- 言守 詞葉: Multilingual Strategy Lead. Japanese/English/Korean/Chinese support, language detection, routing, fallback.
- 速水 光莉: Latency & Benchmark Lead. Latency measurement, benchmark method, optimization candidates.
- 星宮 未来: Product Growth & SNS Lead. GitHub Star, README, demo, X posting, community path.
- 文月 栞里: Documentation & Operations Lead. ROADMAP, owner table, decision log, progress board, implementation notes.
- 白瀬 怜奈: Quality Judge & Risk Officer. Scope creep, privacy, API billing, public-release and overengineering risks.

## Non-Negotiable Constraints

- Default response and operator-facing notes are Japanese unless a public English artifact requires English.
- Do not run paid API-style paths by default.
- Do not run `claude -p`.
- Do not use or expose API keys/secrets.
- Keep API TTS optional; preserve local-first defaults unless the master explicitly changes direction.
- Do not make large implementation changes during this roadmap-prep tranche.
- Record nontrivial judgments and compromises in task receipts or implementation notes.
- Prefer small PRs with clear proof.
- Avoid neutral-default regressions: public-facing defaults must not include user-specific persona wording.

## Stop Rule

Stop only when a final audit proves this roadmap-operating tranche is complete.

Do not stop after naming agents or listing ideas if the roadmap, owner model, proof model, and next PR candidates are still missing.

Do not start paid API integration, secret handling, or large code refactors during this tranche. Mark them as follow-up candidates with decision checkpoints.

## Slice Sizing

Safe means bounded, explicit, verified, and reversible. It does not mean tiny.

For this tranche, Scout work should be parallel and read-only. Worker work should be limited to roadmap/board/docs artifacts unless the master approves implementation.

## Canonical Board

Machine truth lives at:

`docs/goals/talking-pets-roadmap/state.yaml`

If this charter and `state.yaml` disagree, `state.yaml` wins for task status, active task, receipts, verification freshness, and completion truth.

## Run Command

```text
/goal Follow docs/goals/talking-pets-roadmap/goal.md.
```

## PM Loop

On every `/goal` continuation:

1. Read this charter.
2. Read `state.yaml`.
3. Re-check the oracle, constraints, current task, and receipts.
4. Work only on the active board task.
5. Delegate to STELLAVOX role agents only when the subtask is bounded and materially advances the roadmap.
6. Write a compact receipt in `notes/` or in `state.yaml`.
7. Update task status, owner, proof, and next action.
8. Ask the master only for decisions that affect scope, billing, privacy, public positioning, or implementation direction.
9. Finish only with a Judge/PM audit receipt that maps artifacts back to the oracle and records `full_outcome_complete: true`.
