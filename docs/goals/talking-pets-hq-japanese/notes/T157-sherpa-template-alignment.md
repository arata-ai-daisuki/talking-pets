# T157 Sherpa Template Alignment

## Objective

既存の`sherpa-onnx-design.md`を、provider design note templateの観点に揃える。

## Added

- `docs/research/sherpa-onnx-design.md` に `Provider Template Alignment` を追加した。
- Candidate、Integration Shape、Boundariesを明示した。
- `sherpa-onnx-node`はL0 design-only / dependency-and-model-review candidateのままにした。
- contributor evidenceはsanitized Platform verification issueに寄せ、generated WAV attachmentはterms review前に求めない停止線を追加した。

## Guardrails

- `sherpa-onnx-node` dependencyは追加していない。
- acoustic model、vocoder、tokens、espeak-ng dataはdownloadしていない。
- helper実装、README support wording、default routeは追加していない。

## Receipt

- decision: `sherpa_template_alignment`
- result: done
- next: Masterがsherpa実験を承認したら、このalignmentをもとにoptional helper PRのscopeを切る。
