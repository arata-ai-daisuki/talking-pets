# T171 Local TTS Master Choice Card

## Objective

Backlog BoardのNext列にあるLocal TTS設計を、VOICEVOX/Irodori evidence継続、sherpa設計、MeloTTS設計からMasterが選べるChoice Cardへ落とす。

## Added

- `docs/research/tts-provider-comparison.md` に `Local TTS Master Choice Card` を追加した。
- A: evidence-first、B: sherpa design-only、C: MeloTTS runtime design-onlyを整理した。
- Default next PRはA継続とし、Masterが明示的にB/Cを選んだ場合だけ設計深掘りへ進む形にした。
- `hq-backlog-board.md` のActiveをLocal TTS設計へ進めた。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- READMEの対応provider claimは増やしていない。
- Master承認なしにsherpa/Melo実験へ進めていない。
- Korean / Chinese dedicated provider support claimは追加していない。

## Receipt

- decision: `local_tts_master_choice_card`
- result: done
- next: MasterがB/Cを選ばなければ、AのVOICEVOX/Irodori contributor evidence request/updateへ進む。
