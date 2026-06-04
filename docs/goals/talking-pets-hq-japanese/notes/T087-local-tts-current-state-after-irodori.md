# T087 local TTS current state after Irodori

## 結論

PR #13でIrodori-TTS Server providerが追加済み。

T061の `sherpa-onnx-nodeをnpm installするか、local TTSを保留してoutreach優先にするか` という判断は、Day 1 outreach送信とIrodori provider追加により古くなった。

今のlocal TTS現在地は次の通り。

| provider | 現在地 | default routing |
| --- | --- | --- |
| VOICEVOX | 日本語の既存優先provider | `ja` |
| Kokoro.js | 英語の既存優先provider | `en` |
| Irodori-TTS Server | experimental optional providerとして追加済み | 明示 `--tts irodori` のみ |
| OS speech | ko/zh/other fallback | `ko` / `zh` / `other` |
| sherpa-onnx-node | package/license公開情報調査まで | 未導入 |

## 確認した実装

- `scripts/tts-irodori.mjs`
- `scripts/pet-rollout-monitor.mjs`
- `install.command` / `install.sh` / `install.ps1`
- `start-selected-tts.*`
- `check.*`
- `README.md` / `README.en.md`
- `CREDITS.md`

Irodoriは `http://127.0.0.1:8088` のIrodori-TTS-Serverへ送るoptional provider。

Irodori server起動、health call、音声生成、model download、API callはしていない。

## 検証

```bash
npm run check:syntax
npm run test:dry-run
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ja-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/en-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/ko-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/zh-traditional-rollout.jsonl
node --no-warnings scripts/pet-rollout-monitor.mjs --once --dry-run --diagnose-routing --rollout test/fixtures/symbol-only-rollout.jsonl
```

結果:

- syntax: pass
- dry-run: pass
- ja: `chosenEngine=voicevox`
- en: `chosenEngine=kokoro`
- ko: `chosenEngine=say`
- zh: `chosenEngine=say`
- zh-traditional: `chosenEngine=say`
- symbol-only/other: `chosenEngine=say`

## 判断

次のlocal TTS判断はsherpa installではなく、Irodori追加後の検証範囲に更新する。

## 状態

done。
