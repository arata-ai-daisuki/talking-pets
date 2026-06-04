# T148 MeloTTS runtime boundary

## 結論

MeloTTSは、現時点ではruntime-review candidateのままにする。

## 変更

- MeloTTSはMIT表示で、English / Spanish / French / Chinese / Japanese / Korean examplesがあることを記録した。
- 公開install docsの導線がPython-firstで、`pip install -e .` と `python -m unidic download` を含むことを記録した。
- Windowsや一部macOSではDockerが提案されていること、requirementsにPython/Torch/audio/NLP依存が多いことを記録した。
- Talking Petsに入れる場合は、user-installed CLI、user-started local server、Docker、Python helperのどれを使うかを先に設計する停止線を追加した。

## Sources

- https://github.com/myshell-ai/MeloTTS
- https://github.com/myshell-ai/MeloTTS/blob/main/docs/install.md
- https://github.com/myshell-ai/MeloTTS/blob/main/requirements.txt
- https://github.com/myshell-ai/MeloTTS/blob/main/LICENSE

## 状態

active。
