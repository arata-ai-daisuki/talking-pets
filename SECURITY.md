# Security Policy

## Supported Versions

Talking Pets is pre-1.0. Security fixes target the latest commit on `main`.

## Reporting A Vulnerability

Please open a private security advisory on GitHub if available, or contact the maintainer through the repository owner profile.

Do not include private Codex logs, rollout JSONL files, local `state_5.sqlite`, generated audio containing private content, or credentials in public issues.

## Local Data And Privacy

Talking Pets reads local Codex conversation metadata and rollout JSONL files so it can find the latest assistant message.

By default:

- It does not patch Codex Desktop.
- It does not modify signed app bundles.
- It does not call an LLM summarizer.
- It does not send assistant text to OpenAI API.
- It may call local TTS providers such as VOICEVOX Engine.
- Kokoro.js may download model files on first use.

If you configure a custom TTS endpoint, review that endpoint's privacy behavior before sending private conversation text to it.
