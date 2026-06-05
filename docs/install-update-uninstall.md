# Install / Update / Uninstall Safety

Last updated: 2026-06-05

This page defines the current safe boundary for Talking Pets install, update, and uninstall work. It is a design and user guidance page. The maintenance helper below is dry-run only and does not run deletion commands.

## Ownership Boundary

| Item | Owner | Update behavior | Uninstall behavior |
| --- | --- | --- | --- |
| Repository files | Talking Pets repo | Updated by `git pull`, release download, or package reinstall. | Remove the repository folder only when you no longer need the project. |
| `node_modules/` | Local install inside the repo | Recreated by `npm ci` when needed. | Safe to delete if you no longer run npm-based providers. It can be recreated later. |
| `.talking-pets.local.env` | User config | Preserve by default. Rerunning installers can recreate it, so copy or review it before replacing. | Delete only if you want to remove local Talking Pets settings. |
| `presets/examples/*.env` | Talking Pets repo | Updated with the repo. | No separate action unless removing the repo. |
| Codex local state and rollout JSONL | Codex app | Read-only from Talking Pets. | Do not delete for Talking Pets uninstall. |
| Kokoro model cache | User machine cache | First Kokoro use may populate `~/.cache/talking-pets/transformers`. | Optional user cleanup. Do not delete during normal uninstall without confirmation. |
| VOICEVOX / Voicebox / Irodori runtime | User-managed external runtime | Start, stop, update, and configure outside Talking Pets. | Uninstall from its own app/runtime instructions, not from Talking Pets. |
| MeloTTS runtime/cache | User-managed external runtime candidate | Talking Pets only health-checks when explicitly configured. | Uninstall from the user-managed Python/Docker/runtime path. Cache location is runtime-specific. |
| API keys/secrets | User secret store or environment | Talking Pets should not create or store API keys without explicit opt-in design. | Remove from the place where the user stored them; do not infer secret locations. |
| Generated evidence, recordings, logs | User / contributor | Keep only sanitized public evidence in docs or issues. | Optional cleanup. Review before deleting because it may be release proof. |

## Safe Update Flow

Use this flow before changing installer scripts or asking users to update:

1. Check for local config:

```bash
test -f .talking-pets.local.env && echo "config exists"
```

2. Preserve the current config before regenerating it:

```bash
cp .talking-pets.local.env .talking-pets.local.env.backup
```

3. Update repo files or reinstall dependencies:

```bash
npm ci
npm run check:all
```

4. If you rerun an installer, compare the config before replacing a working setup:

```bash
diff -u .talking-pets.local.env.backup .talking-pets.local.env
```

5. Recheck the selected provider:

```bash
npm run monitor:node -- --list-provider-capabilities
npm run check:config
```

## Safe Uninstall Flow

Use this as the current manual uninstall guide. The dry-run helper prints the same ownership boundary before any future automation exists.

```bash
npm run maintenance:plan -- --uninstall --dry-run
npm run maintenance:plan -- --uninstall --dry-run --format json
```

| Action | Command example | Safety note |
| --- | --- | --- |
| Stop the monitor | `Ctrl-C` in the running terminal | This only stops the current process. |
| Remove local config | `rm .talking-pets.local.env` | Removes Talking Pets settings for this repo only. |
| Remove npm dependencies | `rm -rf node_modules` | Recreated by `npm ci`; do not run from the wrong directory. |
| Remove Kokoro cache | `rm -rf ~/.cache/talking-pets/transformers` | Optional. This may force model download again later. |
| Remove repo | Delete the repository folder | Only after confirming there is no local work you need. |
| Remove external runtimes | Use each runtime's own uninstall docs | Talking Pets should not remove VOICEVOX, Irodori, Docker, Python, or API secrets for the user. |

## Dry-Run Helper

The current helper is intentionally dry-run only:

```bash
npm run maintenance:plan -- --update --dry-run
npm run maintenance:plan -- --uninstall --dry-run
```

It prints:

- files that would be kept
- files that could be removed
- external runtimes that are user-managed
- model cache paths that are optional cleanup
- API secret locations that are unknown or user-managed
- rollback step for any config rewrite

Stop before adding real actions if a helper would delete files without showing the exact path first.
