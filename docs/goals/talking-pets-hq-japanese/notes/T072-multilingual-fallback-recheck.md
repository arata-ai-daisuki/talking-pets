# T072 multilingual fallback recheck

## 結論

現在のREADME / README.en / FUTURE_PLAN / ROADMAPの多言語表現は、fixture実挙動と整合している。

書いてよい:

- Japanese and English are prioritized.
- Korean and Chinese are first-class fallback paths.
- Korean and Chinese route to OS speech fallback for now.
- `--speech-language ja|en|ko|zh|other` can force the spoken language.

書かない:

- Korean dedicated TTS support.
- Chinese dedicated TTS support.
- production-ready multilingual TTS.
- quality guarantee for Korean / Chinese speech.

## 再検証

| case | fixture | detectedLanguage | effectiveLanguage | chosenEngine | fallbackReason |
| --- | --- | --- | --- | --- | --- |
| Korean auto | `test/fixtures/ko-rollout.jsonl` | `ko` | `ko` | `say` | `ko uses OS speech fallback; no dedicated provider is configured.` |
| Simplified Chinese auto | `test/fixtures/zh-rollout.jsonl` | `zh` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |
| Traditional Chinese auto | `test/fixtures/zh-traditional-rollout.jsonl` | `zh` | `zh` | `say` | `zh uses OS speech fallback; no dedicated provider is configured.` |

## 実行コマンド

```bash
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
rg -n "multilingual|language|ko|zh|Korean|Chinese|fallback|say|TTS|voice" README.md README.en.md FUTURE_PLAN.md docs/ROADMAP.md docs/goals/talking-pets-hq-japanese/notes/T057-multilingual-current-claim-audit.md
```

## 次

多言語は、今は「claimを正確に保つ」段階でよい。

専用provider調査は、local TTSのinstall-only実験かoutreach反応のあとでよい。

## まだしていないこと

- 専用 Korean TTS provider追加
- 専用 Chinese TTS provider追加
- model download
- audio playback
- README claim変更

## 状態

done。
