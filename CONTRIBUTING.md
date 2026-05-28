# Contributing

Thanks for helping improve Talking Pets.

## Local Checks

Run these before opening a pull request:

```bash
npm ci
npm run check:syntax
npm run test:dry-run
```

For macOS manual checks:

```bash
./check.command
./scripts/pet-rollout-monitor.command --once --dry-run
```

For Windows experimental checks:

```powershell
.\check.ps1
node scripts/pet-rollout-monitor.mjs --once --dry-run
```

## Pull Requests

- Keep changes small and focused.
- Update `README.md` and `README.en.md` together when user-facing behavior changes.
- Update `implementation-notes.md` when making a judgment call, compromise, or public-facing behavior change.
- Do not bundle VOICEVOX, Kokoro model files, generated audio, or local Codex logs.
- Avoid changes that patch Codex Desktop or modify signed app bundles.

## Issues

When reporting a problem, include:

- OS and version
- Node.js version
- TTS provider
- Command you ran
- Relevant `./check.command` or `.\check.ps1` output
- Whether Codex is saving local logs
