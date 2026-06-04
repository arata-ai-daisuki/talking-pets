# T144 local TTS next provider gate

## 結論

TTS provider comparisonに、新しいlocal TTS provider候補を実装へ進める前のapproval gateを追加した。

## 変更

- dependency、model download、license、privacy、platform、measurement、public wordingの確認項目を追加した。
- sherpa-onnx-nodeはMaster承認後のdesign-only local provider候補として維持した。
- API TTSはlocal-firstとは別のopt-in cloud/remote pathとして分離した。
- Piper / Melo / その他多言語providerは、package shape、model size、language coverage、license termsのdesign noteができるまで追加しない方針を明記した。

## 状態

active。
