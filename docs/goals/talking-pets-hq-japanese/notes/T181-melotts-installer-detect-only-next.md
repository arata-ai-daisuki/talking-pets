# T181 MeloTTS Installer Detect-Only Next

## Objective

MeloTTS monitor health integration後に、installer/configへ進む場合の小PR範囲をdetect-only wordingへ限定する。

## Candidate Scope

- installerやconfigの案内に、MeloTTSはuser-managed external runtime候補であることを明記した。
- `--tts melotts --list-voices` のhealth-only導線へ誘導する。
- 未設定時はinstall失敗ではなく `not_configured` として扱う。

## Stop Lines

- MeloTTS、Python packages、Docker images、model、dictionary、language assetsをdownload/installしない。
- installerでMeloTTSを選択済みproviderとして扱わない。
- READMEの対応TTS claimを増やさない。
- default routingや音声合成には入れない。

## Receipt

- decision: `melotts_installer_detect_only_wording_next`
- owner: `白瀬 怜奈`
- status: done
- next: decide whether to implement detect-only wording or switch to provider feedback capture.
