# T004 profile latency receipt

- Added `--profile-latency` to the Node rollout monitor only.
- Kept normal monitor output on stdout for compatibility.
- Printed one `[latency]` line per monitor cycle to stderr with total time, measured steps, and small run metadata.
- Added `npm run benchmark:dry-run` as the smallest reusable dry-run benchmark command.
- Did not touch TTS helper scripts or optimize latency; this is measurement-only.
