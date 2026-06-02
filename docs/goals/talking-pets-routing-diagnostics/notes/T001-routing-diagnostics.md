# T001 Routing Diagnostics Receipt

Owner role: 言守 詞葉

## Result

Done.

Added `--diagnose-routing` to `scripts/pet-rollout-monitor.mjs`.

## Behavior

The option:

- forces dry-run
- keeps normal `[source]` and `[pet]` output
- prints JSON diagnostics for the chosen route
- does not play audio
- does not contact any external provider

## Diagnostic Fields

- `sourceText`
- `spokenText`
- `detectedLanguage`
- `speechLanguageHint`
- `effectiveLanguage`
- `ttsEngineConfigured`
- `languageRoute`
- `chosenEngine`
- `fallbackReason`
- `summary`
- `sourceCharacters`

## Verification

```bash
node --check scripts/pet-rollout-monitor.mjs
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
npm run test:dry-run
```

All passed.

## Important Observation

The `zh` fixture shows `chosenEngine: "say"` and a fallback reason, while `spokenText` drops the first short sentence due to summary selection. This is useful proof that diagnostics can expose both routing and summarization behavior.
