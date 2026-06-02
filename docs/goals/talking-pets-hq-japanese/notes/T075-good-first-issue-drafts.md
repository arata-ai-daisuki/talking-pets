# T075 good first issue drafts

## 結論

外部の人に参加してもらう最初のGitHub Issue候補は、実装より **確認・フィードバック系** が安全。

このメモではIssue作成しない。

## 既存template

使えるtemplate:

- `.github/ISSUE_TEMPLATE/install_trouble.yml`
- `.github/ISSUE_TEMPLATE/tts_provider_request.yml`
- `.github/ISSUE_TEMPLATE/bug_report.yml`

## Draft 1: Windows first-run verification

Title:

```text
[Help wanted] Verify Windows first-run path
```

Labels:

```text
help wanted, good first issue, windows
```

Body:

```markdown
Talking Pets has an experimental Windows monitor path, but the current verified demo is macOS-first.

Could someone on Windows 11 try the first-run flow and report where it succeeds or stops?

Please check:

- Node.js 22 or later is available
- `npm install` completes
- `.\check.ps1` runs
- dry-run monitor can read the fixture path
- OS speech or configured TTS path is clear

Please do not paste private Codex conversation text. If paths include your username, redact them.

Useful output:

- OS version
- Node.js version
- command you ran
- relevant check output
- where setup stopped, if it stopped
```

Why:

- README currently marks Windows as experimental.
- A real Windows report improves public confidence without requiring new feature work.

## Draft 2: Linux audio playback verification

Title:

```text
[Help wanted] Verify Linux audio playback path
```

Labels:

```text
help wanted, good first issue, linux
```

Body:

```markdown
Talking Pets supports an experimental Linux path, but real Linux audio playback is not yet verified in the current release notes.

Could someone on Linux try the check flow and report which playback command works?

Please check:

- Node.js 22 or later is available
- `npm install` completes
- `./check.command` or the Node check scripts run
- one of `aplay`, `papaplay`/`paplay`, `ffplay`, or `espeak` is available
- dry-run works without exposing private conversation text

Please include:

- distribution and version
- desktop/audio environment if relevant
- command output
- which audio command exists
- what failed, if anything failed
```

Why:

- Linux support should stay honest until audio playback is verified.
- This gives contributors a useful, bounded way to help.

## Draft 3: Local TTS provider suggestions

Title:

```text
[TTS] Suggest a local provider for Korean / Chinese / multilingual voices
```

Labels:

```text
enhancement, tts, provider-research
```

Body:

```markdown
Talking Pets currently prioritizes Japanese and English.

Korean and Chinese are first-class fallback paths, but they currently route to OS speech fallback, not dedicated TTS providers.

If you know a good local/offline-friendly provider for Korean, Chinese, or multilingual TTS, please share:

- provider or voice library name
- supported platforms
- local API or CLI command shape
- model size / install size, if known
- license and credit requirements
- whether commercial/public demo usage needs attribution
- whether it can run without sending text to a cloud API

Please do not include API keys, private endpoints, or private model files.
```

Why:

- It invites useful provider research without overclaiming Korean/Chinese support.
- It aligns with the existing `tts_provider_request.yml` template.

## 推奨順

1. Windows first-run verification
2. Linux audio playback verification
3. Local TTS provider suggestions

## 出さない方がよいIssue

- "Please star this repo"
- "Implement OpenAI TTS now"
- "Add Korean/Chinese dedicated TTS support" without provider/license scope
- "Build full settings UI" before setup friction evidence

## 状態

done。

Issue作成、outreach送信、npm install、model download、API callはしていない。
