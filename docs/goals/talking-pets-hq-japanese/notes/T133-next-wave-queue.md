# T133 next wave queue

## 結論

PR #36-#39で、local TTS測定、協力者向けlatency報告欄、READMEのRTF導線、多言語routing証跡境界が進んだ。

次は、待ちが必要な外部反応に依存しすぎず、以下の順で進める。

## 完了した波

- PR #36: VOICEVOX/Irodoriのmaintainer RTF snapshotを追加した。
- PR #37: Platform verification issueにVOICEVOX/Irodori latency報告欄を追加した。
- PR #38: README / README.enからRTF snapshotへ辿れるようにした。
- PR #39: 多言語fixture diagnosticはrouting-only証跡であり、ko/zh専用TTS claimではないことを明記した。

## 次の実行キュー

1. Post metrics receipt
   - Masterが投稿URLをくれたらT007/T123へ記録する。
   - URLがない場合は、投稿済み事実だけを追い、再投稿や催促はしない。

2. External verification intake
   - issue #23-#26にsanitized evidenceが来たら `docs/verification-status.md` を更新する。
   - evidenceがない間は、verified扱いしない。

3. No-download local TTS work
   - Kokoro model downloadはMaster承認まで保留する。
   - sherpa-onnx-node/API TTSは依存追加/API keyが絡むため設計のみ。
   - 安全に進めるなら、既存fixtureと既存helperのdiagnostics改善、または報告テンプレ整備を優先する。

## 判断

いま次に実装へ進めるなら、外部証跡待ちではなく、no-download local TTSのdiagnostics改善が一番安全。

## 状態

active。
