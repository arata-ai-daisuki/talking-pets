# PR Preflight Kit

Last updated: 2026-06-12

Use this kit before staging or opening a PR. It is intentionally short enough to run in about five minutes.

## Five-Minute Preflight

| Step | Check | Stop if |
| --- | --- | --- |
| 1 | Name the PR purpose in one sentence. | The PR mixes unrelated feature, docs, release, and operations work. |
| 2 | List the files you expect to stage. | Generated files, local logs, recordings, private paths, or unrelated GoalBuddy output appear. |
| 3 | Pick the evidence boundary from `docs/verification-matrix.md`. | Fixture evidence is being used as audible or platform evidence. |
| 4 | Check public wording with `docs/release-doc-sync-matrix.md`. | README, verification status, release notes, or issue templates would drift. |
| 5 | Run the smallest relevant command set. | A required command is skipped without recording why. |

## Red Flags

| Category | Red flag | Clean response |
| --- | --- | --- |
| Claim too strong | README says a language, provider, platform, or latency result is supported beyond current evidence. | Keep wording to fixture, fallback, experimental, or maintainer-environment evidence. |
| Private evidence | PR includes local Codex logs, private rollout JSONL, SQLite DBs, local env files, generated audio, recordings, or absolute local paths. | Remove from stage and keep only sanitized public evidence. |
| Scope drift | A provider PR also changes release templates, issue fields, and unrelated roadmap notes. | Split into the smallest PR that preserves review context. |
| Verification mismatch | `--no-state` or fixture-only output is used to graduate platform status. | Treat it as supplemental evidence and wait for real-device proof. |
| Unsafe automation | Update/uninstall helpers delete files, infer secret locations, or touch external runtime caches without explicit review. | Keep destructive operations dry-run only until exact paths and rollback are reviewed. |
| External boundary leak | Remote API, local server, model download, or paid path runs from a default command. | Require explicit opt-in command and update privacy/billing docs. |

## Command Sets

For docs-only PRs:

```bash
npm run check:docs
npm run check:release
```

For package or packaged-doc PRs:

```bash
npm run check:docs
npm run check:pack
npm run check:release
```

For monitor, fixture, or routing PRs:

```bash
npm run check:syntax
npm test
npm run test:dry-run
```

For provider, installer, or evidence PRs:

```bash
npm run check:all
npm run maintenance:plan -- --update --dry-run
npm run maintenance:plan -- --uninstall --dry-run
npm run check:sanitize
```

## PR Body Snippet

```md
Preflight:
- purpose: <one sentence>
- staged scope: <files or areas>
- evidence boundary: <fixture|stateful|audible|sandbox-sensitive|opt-in external>
- red flags checked: claim too strong / private evidence / scope drift
- verification: <commands>
```
