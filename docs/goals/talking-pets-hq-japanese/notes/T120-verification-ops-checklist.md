# T120 verification ops checklist

## 結論

T119の公開検証ループを、週次で回せる運用チェックリストにした。

このメモではIssue返信、SNS投稿、README更新はしない。

## 対象Issue

| Issue | 目的 | 見るポイント |
| --- | --- | --- |
| #23 | Ubuntu 24.04 audible TTS | `audible: yes`, sanitized output, audio command, distro/version |
| #24 | Windows 11 audible TTS | `audible: yes`, sanitized output, PowerShell output, Windows version |
| #25 | Irodori latency on another GPU or CPU | backend, cold/warm, playback込みか、audio duration |
| #26 | VOICEVOX latency on another machine | speaker, engine version, warm runs, playback込みか |

## 週次チェック

1. `gh issue list --state open --limit 30` で対象Issueがopenか確認する。
2. 対象Issueに新規コメントがあるか見る。
3. 新規コメントがあればT115の採用基準で分類する。
4. 採用できる場合だけ `docs/verification-status.md` 反映PRを切る。
5. 採用できない場合は、追加情報またはsanitize依頼テンプレで返信案を作る。
6. 返信や投稿はMaster確認後に手動で行う。

## 分類

| 分類 | 条件 | 次 |
| --- | --- | --- |
| usable | 環境、command、TTS path、audible/sanitizedが揃う | verification-status反映PR |
| needs-info | version、command、audible有無などが不足 | T115追加情報テンプレ |
| needs-sanitize | private path、conversation text、local log detailがある | T115 sanitize依頼テンプレ |
| latency-unclear | playback込みかsynthesisのみか不明 | T115 latency切り分けテンプレ |
| not-evidence | generated audio、recording、archive、model file添付が中心 | 採用しない。必要なら安全に再提出依頼 |

## Issue別返信の方向

### #23 Linux

聞き返す優先順:

1. distro/version
2. audio command (`espeak`, `aplay`, `paplay`, `ffplay`, other)
3. audible yes/no
4. sanitized output

### #24 Windows

聞き返す優先順:

1. Windows version
2. PowerShell command output
3. TTS path (`System.Speech`, VOICEVOX, Kokoro, other)
4. audible yes/no
5. sanitized output

### #25 Irodori

聞き返す優先順:

1. CPU/GPU/backend
2. cold vs warm state
3. total includes playback completion or not
4. generated audio duration
5. server setting changes

### #26 VOICEVOX

聞き返す優先順:

1. VOICEVOX version if known
2. speaker id/name
3. warm synthesis runs
4. total includes playback completion or not
5. generated audio duration

## 反映しないもの

- private path or usernameが残ったoutput
- Codex conversation text
- rollout JSONL
- local SQLite DB
- generated audio or recording
- model files
- unsanitized archive

## 状態

done。
