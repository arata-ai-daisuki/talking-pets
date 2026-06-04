# T170 Outreach Ready-To-Send Queue

## Objective

Backlog BoardのNext列にあるoutreach送信準備を、候補、使うテンプレ、one ask、送信後記録先が見えるReady-To-Send Queueへ落とす。

## Added

- `docs/research/x-outreach-targets.md` に `Ready-To-Send Queue` を追加した。
- OpenClaw / local voice builders、Multilingual local TTS experimenters、Codex / voice avatar buildersの3候補を優先順にした。
- 各候補に使うtemplate、one ask、送信後記録先を付けた。
- `hq-backlog-board.md` のActiveをOutreach送信準備へ進め、Done HistoryにT169を畳んだ。

## Guardrails

- 自動返信、DM、follow、like、mentionはしていない。
- `sent` にはしていない。
- Star依頼をfirst contactにしていない。
- generated audio、private logs、local path入りscreenshotを求めていない。

## Receipt

- decision: `outreach_ready_to_send_queue`
- result: done
- next: Masterが手動送信したら、public URLをSearch Review LogとT007 trackingに記録する。
