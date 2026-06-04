# T147 Piper license boundary

## 結論

Piper系providerは、現時点ではlicense-review candidateのままにする。

## 変更

- `rhasspy/piper` はarchive済みかつMIT表示、READMEが `OHF-Voice/piper1-gpl` への移管を示すことを記録した。
- `OHF-Voice/piper1-gpl` は現行確認対象としてGPL-3.0表示、`pip install piper-tts` 導線があることを記録した。
- PyPI `piper-tts` は存在を確認したが、wheel内容、bundle library、model download、per-voice licenseは未確認として扱った。
- Piperをdependency、optionalDependency、installer choice、default route、README supported providerに進める前の停止線を追加した。

## Sources

- https://github.com/rhasspy/piper
- https://github.com/OHF-Voice/piper1-gpl
- https://pypi.org/project/piper-tts/

## 状態

active。
