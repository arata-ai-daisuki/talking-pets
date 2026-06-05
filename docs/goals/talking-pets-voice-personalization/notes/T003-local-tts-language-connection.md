# T003 Local TTS / Language Connection

## 担当

- 歌澄 音羽: TTS Worker
- 言守 詞葉: Language Worker

## 目的

local TTS providerと言語対応を、provider registry、preferences、routing diagnostics、READMEへ接続する。

## 期待する成果

- local TTS providerの対応状況がREADME/docsから分かる。
- user preferencesのprovider優先度とrouting diagnosticsが、言語fallback理由とつながる。
- fallback-onlyとprovider-specific supportを混同しない。
- 少なくとも1つのlocal TTS provider改善または追加につながる小PR候補を確定する。

## 停止線

- 新規providerを証拠なしにsupportedとclaimしない。
- model downloadが必要になったら、まずdocsまたはdry-run境界から扱う。
- external runtimeのinstall/downloadはMaster承認なしに実行しない。
