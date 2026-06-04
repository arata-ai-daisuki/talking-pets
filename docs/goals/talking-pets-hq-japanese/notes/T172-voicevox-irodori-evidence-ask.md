# T172 VOICEVOX / Irodori Evidence Ask

## Objective

Local TTS Master Choice CardのA継続として、VOICEVOX/Irodori外部検証を集めるための短い依頼文をSNS戦略に追加する。

## Added

- `docs/research/sns-outreach-strategy.md` に `VOICEVOX / Irodori evidence ask` を追加した。
- VOICEVOX latency on another machine、Irodori-TTS Server latency on another CPU/GPU/backendを明示した。
- sanitized latency lines、device/OS、provider version、warm synthesis、audio duration/RTF、audible resultを求める文面にした。
- generated audio filesやprivate logsは不要と明記した。
- `hq-backlog-board.md` のActiveをA evidence requestへ進めた。

## Guardrails

- provider実装、依存追加、model download、API callはしていない。
- 自動投稿、DM、follow、like、mentionはしていない。
- generated audioやprivate logsの添付を求めていない。
- VOICEVOX/Irodoriの性能保証claimは追加していない。

## Receipt

- decision: `voicevox_irodori_evidence_ask`
- result: done
- next: 手動outreachでVOICEVOX/Irodori環境を持つ人に出会った時、この依頼文を使う。
