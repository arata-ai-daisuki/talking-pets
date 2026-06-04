# T132 multilingual evidence boundary

## 結論

多言語routingについて、fixture diagnosticで証明できる範囲と、実機audible証跡が必要な範囲を `docs/verification-status.md` に追加した。

## 実行したrouting diagnostics

- `ja-rollout.jsonl`: `ja` -> `voicevox`
- `en-rollout.jsonl`: `en` -> `kokoro`
- `ko-rollout.jsonl`: `ko` -> `say`
- `zh-rollout.jsonl`: `zh` -> `say`
- `zh-traditional-rollout.jsonl`: `zh` -> `say`
- `symbol-only-rollout.jsonl`: `other` -> `say`

## 判断

- ko/zhはOS speech fallbackであり、専用Korean/Chinese TTS provider対応済みとは書かない。
- fixture diagnosticはrouting claimの証跡として使う。
- 実機の音質、audible yes、first audible speech、専用provider claimには、sanitized real-device evidenceが必要。

## 状態

active。
