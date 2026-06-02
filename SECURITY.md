# Security Policy

## Supported Versions

Talking Pets is pre-1.0. Security fixes target the latest commit on `main`.

## Reporting A Vulnerability

Please open a private security advisory on GitHub if available, or contact the maintainer through the repository owner profile.

Do not include private Codex logs, private rollout JSONL files, local SQLite DBs such as `state_5.sqlite`, local env files, generated audio or recordings containing private content, local archives, macOS metadata, downloaded model files, or credentials in public issues.

## Local Data And Privacy

Talking Pets reads local Codex conversation metadata and rollout JSONL files so it can find the latest assistant message.

By default:

- It does not patch Codex Desktop.
- It does not modify signed app bundles.
- It does not call an LLM summarizer.
- It does not send assistant text to OpenAI API.
- It may call local TTS providers such as VOICEVOX Engine.
- Kokoro.js may download model files on first use.
- Local config files are parsed as `KEY="value"` data by the launcher scripts, and only known `TALKING_PETS_*` keys are accepted.
- TTS provider error logs should not include spoken text; VOICEVOX / Voicebox request URLs are logged without query strings.

If you configure a custom TTS endpoint, review that endpoint's privacy behavior before sending private conversation text to it.

Before sharing diagnostic output publicly, pipe it through `npm run sanitize:public-output` and still review the result manually. The sanitizer redacts private paths, conversation text, local env values, common credential env/header patterns, private rollout JSONL paths, generated audio names, recording names, archive names, macOS metadata names, local SQLite DB names, and model filenames. It keeps the known public fixture rollout paths visible for evidence.
