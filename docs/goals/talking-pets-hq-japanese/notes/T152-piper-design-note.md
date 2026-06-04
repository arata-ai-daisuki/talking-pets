# T152 Piper Design Note

## Objective

Piperを実装前のprovider-specific design noteへ落とし、依存追加やmodel downloadなしで次の判断材料を揃える。

## Added

- `docs/research/piper-design-note.md` を追加した。
- PiperはL0 design-only / license-review candidateとして扱った。
- user-installed external CLI/serviceのみを将来候補にし、normal install pathへ混ぜない停止線を明記した。
- `docs/research/tts-provider-comparison.md` からPiper design noteへ導線を追加した。

## Guardrails

- `piper-tts` installはしていない。
- model、voice、vocoder、language dataはdownloadしていない。
- README support wordingやdefault routingは追加していない。
- GPL compatibilityについて法的助言として断定していない。

## Receipt

- decision: `piper_design_note`
- result: done
- next: provider feedbackまたはMaster判断が来たら、license-focused review noteへ進めるか、Piperをdesign-onlyのまま保留する。
