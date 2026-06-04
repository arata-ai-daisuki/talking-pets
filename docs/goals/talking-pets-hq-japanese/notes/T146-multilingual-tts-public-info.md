# T146 multilingual TTS public info

## 結論

Piper / MeloTTSの一次公開情報だけを確認し、TTS provider comparisonへdesign-only snapshotとして追記した。

## 変更

- Piperは旧`rhasspy/piper`がarchiveされ、現行`OHF-Voice/piper1-gpl`はGPL-3.0表示であるため、license-sensitive候補として扱うことを記録した。
- MeloTTSはMIT repo license、多言語例、CLI/Python APIがある一方で、Python-first install、`python -m unidic download`、Docker導線があるためruntime-sensitive候補として扱うことを記録した。
- どちらもdefault routing、dependencies、install prompt、model download、README support claimへ進めていない。

## Sources

- https://github.com/rhasspy/piper
- https://github.com/OHF-Voice/piper1-gpl
- https://github.com/myshell-ai/MeloTTS
- https://github.com/myshell-ai/MeloTTS/blob/main/docs/install.md

## 状態

active。
