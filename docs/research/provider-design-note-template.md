# Provider Design Note Template

Use this template before adding a new local TTS provider helper, dependency, README claim, or installer prompt.

This is a design-only document. Filling it out does not approve implementation, dependency installation, model download, API usage, or generated audio attachment.

## Candidate

- Provider:
- Public source:
- Checked date:
- Intended role:
- Proposed readiness level:

## Integration Shape

- User-facing setup path:
- Talking Pets call surface: CLI / user-started local server / HTTP endpoint / OS command / other
- Normal install impact:
- Failure mode when provider is absent:
- Files that would change in a first helper PR:

## Boundaries

| Boundary | Answer |
| --- | --- |
| Dependency |  |
| Model download |  |
| Cache location |  |
| License and attribution |  |
| Privacy and network behavior |  |
| Supported OS / architecture |  |
| Measurement output |  |
| README wording |  |

## Measurement Plan

- Health check:
- Cold start:
- Warm synthesis:
- Audio duration:
- Real-time factor:
- Playback included:
- Sanitized `[latency]` fields:
- Contributor evidence path:

## Stop Lines

Stop and ask Master before:

- adding an npm, Python, binary, Docker, or system dependency
- downloading or caching a model, dictionary, voice, or vocoder
- calling an external API or using an API key
- making README support claims
- changing default provider routing
- attaching generated audio files to public issues

## Decision

- Recommendation: keep design-only / write experiment PR / ask Master / reject for now
- Reason:
- Next safe action:
