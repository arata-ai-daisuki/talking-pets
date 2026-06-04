# T169 Provider Master Decision Memo

## Objective

Provider Decision CardをMaster向けの短い判断メモへ落とし、現時点の推奨と切り替え条件を一画面にする。

## Added

- `docs/research/tts-provider-comparison.md` に `Master Decision Memo` を追加した。
- 現時点の推奨を `A: keep gathering contributor evidence` とした。
- B/C/Dへ切り替える条件を短く整理した。
- install、model download、API key/call、helper実装、README claim、default routing変更には別途Master承認が必要と明記した。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- READMEの対応provider claimは増やしていない。
- Master承認なしにsherpa/Melo/API実験へ進めていない。
- Korean / Chinese dedicated provider support claimは追加していない。

## Receipt

- decision: `provider_master_decision_memo`
- result: done
- next: 返信や検証協力が来るまではAを継続し、MasterがB/C/Dを明示選択したら次の小PRに切る。
