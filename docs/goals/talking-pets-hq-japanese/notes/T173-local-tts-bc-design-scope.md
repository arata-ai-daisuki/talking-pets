# T173 Local TTS B/C Design Scope

## Objective

MasterがLocal TTS Master Choice CardのB/Cを選んだため、sherpa design-onlyとMeloTTS runtime design-onlyを、実装なしで次の判断に使えるscopeへ具体化する。

## Added

- `docs/research/sherpa-onnx-design.md` に `B Design-Only Scope` を追加した。
- `docs/research/melotts-design-note.md` に `C Runtime Design-Only Scope` を追加した。
- `docs/research/melotts-design-note.md` に `Runtime Boundary` と `Cache Boundary` を追加した。
- MeloTTSのcacheは現時点ではTalking Petsが所有しない、という境界を明確にした。
- 次のC作業を `metadata-review`、`external-runtime-helper-design`、`isolated-local-experiment` に分けた。
- `docs/research/tts-provider-comparison.md` に `B/C Design Follow-Up` を追加した。
- HQ Backlog BoardとActivity IndexをT173へ進めた。

## Guardrails

- 依存追加、model download、helper実装、README support claimはしていない。
- Korean / Chinese dedicated provider support claimは追加していない。
- generated audioやprivate logsは求めていない。
- B/Cは実装承認ではなく、次の承認質問を明確にする設計作業として扱う。
- Cはruntime/cache境界の設計であり、Python/Docker setupやdownload approvalではない。

## Receipt

- decision: `local_tts_bc_design_scope`
- result: done
- next: MasterがさらにCを進める場合は、metadata-review、external-runtime-helper-design、isolated-local-experimentのどれかを選ぶ。
