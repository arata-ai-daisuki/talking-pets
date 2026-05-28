#!/usr/bin/env swift

import Foundation

struct Options {
    var interval: TimeInterval = 1.0
    var voice = "Kyoko"
    var ttsEngine = "auto"
    var kokoroVoice = "af_heart"
    var kokoroDtype = "q8"
    var kokoroDevice = "cpu"
    var voiceboxURL = "http://127.0.0.1:50021"
    var voiceboxMode = "voicevox"
    var voiceboxSpeaker = "3"
    var voiceboxProfile: String?
    var voiceboxLanguage: String?
    var speechLanguage = "auto"
    var speechStylePath: String?
    var languageRoute = false
    var rate = 185
    var dryRun = false
    var listVoices = false
    var once = false
    var summarizeSpeech = true
    var skipExisting = false
    var maxSourceCharacters = 4000
    var stateDB: String?
    var rolloutPath: String?
    var threadId: String?
    var cwd: String?
}

struct ThreadSelection: Equatable {
    let id: String
    let title: String
    let rolloutPath: String
}

struct SpeechCandidate {
    let timestamp: String
    let source: String
    let text: String
}

func printUsage() {
    print("""
    Usage:
      swift scripts/pet-rollout-monitor.swift [options]

    Options:
      --tts <engine>          TTS engine: auto, kokoro, say, voicebox, voicevox. Default: auto
      --voice <name>          macOS say voice name. Default: Kyoko
      --kokoro-voice <name>   Kokoro voice. Default: af_heart
      --kokoro-dtype <dtype>  Kokoro dtype: fp32, fp16, q8, q4, q4f16. Default: q8
      --kokoro-device <dev>   Kokoro device for Node runtime. Default: cpu
      --voicebox-url <url>    Voicebox/VOICEVOX base URL. Default: http://127.0.0.1:50021
      --voicebox-mode <mode>  voicevox or generic. Default: voicevox
      --voicebox-speaker <id> VOICEVOX speaker/style id. Default: 3 (ずんだもん ノーマル)
      --voicebox-profile <id> Generic profile_id value. Also accepted as VOICEVOX speaker fallback
      --voicebox-language <l> Voicebox language value
      --speech-language <l>   Speech language hint: auto, ja, en, other. Default: auto
      --speech-style <path>   Speech style JSON path. Default: presets/speech-style.json
      --language-route        Route ja/en to language-specific TTS. Default: on for --tts auto
      --no-language-route     Disable language-specific routing
      --rate <number>         macOS say rate. Default: 185
      --interval <seconds>    Poll interval. Default: 1.0
      --thread-id <id>        Read a specific Codex thread
      --cwd <path>            Read the latest thread for this cwd
      --rollout <path>        Read this rollout JSONL directly
      --state-db <path>       Codex state sqlite path. Default: ~/.codex/state_5.sqlite
      --max-source-chars <n>  Ignore source messages longer than this. Default: 4000
      --skip-existing         Do not speak the latest existing line on startup
      --no-summary            Speak the full source text instead of a cute summary
      --dry-run               Print source and speech text without speaking
      --once                  Read once and exit
      --list-voices           Print available voices for the selected TTS engine
      --help                  Show this help
    """)
}

func parseOptions() -> Options {
    var options = Options()
    var args = Array(CommandLine.arguments.dropFirst())

    while !args.isEmpty {
        let arg = args.removeFirst()
        switch arg {
        case "--help", "-h":
            printUsage()
            exit(0)
        case "--voice":
            guard !args.isEmpty else { fatalError("--voice requires a value") }
            options.voice = args.removeFirst()
        case "--tts":
            guard !args.isEmpty else { fatalError("--tts requires a value") }
            options.ttsEngine = args.removeFirst()
        case "--kokoro-voice":
            guard !args.isEmpty else { fatalError("--kokoro-voice requires a value") }
            options.kokoroVoice = args.removeFirst()
        case "--kokoro-dtype":
            guard !args.isEmpty else { fatalError("--kokoro-dtype requires a value") }
            options.kokoroDtype = args.removeFirst()
        case "--kokoro-device":
            guard !args.isEmpty else { fatalError("--kokoro-device requires a value") }
            options.kokoroDevice = args.removeFirst()
        case "--voicebox-url":
            guard !args.isEmpty else { fatalError("--voicebox-url requires a value") }
            options.voiceboxURL = args.removeFirst()
        case "--voicebox-mode":
            guard !args.isEmpty else { fatalError("--voicebox-mode requires a value") }
            options.voiceboxMode = args.removeFirst()
        case "--voicebox-speaker":
            guard !args.isEmpty else { fatalError("--voicebox-speaker requires a value") }
            options.voiceboxSpeaker = args.removeFirst()
        case "--voicebox-profile":
            guard !args.isEmpty else { fatalError("--voicebox-profile requires a value") }
            options.voiceboxProfile = args.removeFirst()
        case "--voicebox-language":
            guard !args.isEmpty else { fatalError("--voicebox-language requires a value") }
            options.voiceboxLanguage = args.removeFirst()
        case "--speech-language":
            guard !args.isEmpty else { fatalError("--speech-language requires a value") }
            options.speechLanguage = args.removeFirst()
        case "--speech-style":
            guard !args.isEmpty else { fatalError("--speech-style requires a value") }
            options.speechStylePath = args.removeFirst()
        case "--language-route":
            options.languageRoute = true
        case "--no-language-route":
            options.languageRoute = false
        case "--rate":
            guard let value = args.first, let rate = Int(value) else { fatalError("--rate requires a number") }
            args.removeFirst()
            options.rate = rate
        case "--interval":
            guard let value = args.first, let interval = TimeInterval(value) else { fatalError("--interval requires a number") }
            args.removeFirst()
            options.interval = interval
        case "--thread-id":
            guard !args.isEmpty else { fatalError("--thread-id requires a value") }
            options.threadId = args.removeFirst()
        case "--cwd":
            guard !args.isEmpty else { fatalError("--cwd requires a path") }
            options.cwd = args.removeFirst()
        case "--rollout":
            guard !args.isEmpty else { fatalError("--rollout requires a path") }
            options.rolloutPath = args.removeFirst()
        case "--state-db":
            guard !args.isEmpty else { fatalError("--state-db requires a path") }
            options.stateDB = args.removeFirst()
        case "--max-source-chars":
            guard let value = args.first, let maxSourceCharacters = Int(value) else { fatalError("--max-source-chars requires a number") }
            args.removeFirst()
            options.maxSourceCharacters = max(1, maxSourceCharacters)
        case "--skip-existing":
            options.skipExisting = true
        case "--no-summary":
            options.summarizeSpeech = false
        case "--dry-run":
            options.dryRun = true
        case "--once":
            options.once = true
        case "--list-voices":
            options.listVoices = true
        default:
            fatalError("Unknown option: \(arg)")
        }
    }

    return options
}

func shellQuoteForSQLite(_ value: String) -> String {
    "'\(value.replacingOccurrences(of: "'", with: "''"))'"
}

func defaultStateDBPath() -> String? {
    if let codexHome = ProcessInfo.processInfo.environment["CODEX_HOME"], !codexHome.isEmpty {
        return URL(fileURLWithPath: codexHome)
            .appendingPathComponent("state_5.sqlite")
            .path
    }

    guard let home = ProcessInfo.processInfo.environment["HOME"], !home.isEmpty else {
        return nil
    }

    return URL(fileURLWithPath: home)
        .appendingPathComponent(".codex")
        .appendingPathComponent("state_5.sqlite")
        .path
}

func resolveThread(options: Options) -> ThreadSelection? {
    if let rolloutPath = options.rolloutPath {
        return ThreadSelection(id: "manual-rollout", title: "manual rollout", rolloutPath: rolloutPath)
    }

    guard let dbPath = options.stateDB ?? defaultStateDBPath() else {
        return nil
    }

    let whereClause: String
    if let threadId = options.threadId {
        whereClause = "id = \(shellQuoteForSQLite(threadId))"
    } else if let cwd = options.cwd {
        whereClause = "cwd = \(shellQuoteForSQLite(cwd)) and archived = 0"
    } else {
        whereClause = """
        archived = 0
        and title not like 'The following is the Codex agent history whose request action you are assessing.%'
        """
    }

    let query = """
    select id, replace(title, char(31), ' '), rollout_path
    from threads
    where \(whereClause)
      and rollout_path is not null
      and rollout_path != ''
    order by coalesce(updated_at_ms, updated_at, 0) desc
    limit 1;
    """

    guard let output = runProcess(
        executable: "/usr/bin/sqlite3",
        arguments: ["-noheader", "-separator", "\u{1F}", dbPath, query]
    ) else {
        return nil
    }

    let line = output
        .split(whereSeparator: \.isNewline)
        .map(String.init)
        .first { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }

    guard let line else {
        return nil
    }

    let parts = line.split(separator: "\u{1F}", omittingEmptySubsequences: false).map(String.init)
    guard parts.count >= 3 else {
        return nil
    }

    return ThreadSelection(id: parts[0], title: parts[1], rolloutPath: parts[2])
}

func readLatestSpeechCandidate(from rolloutPath: String, maxSourceCharacters: Int) -> SpeechCandidate? {
    guard let text = try? String(contentsOfFile: rolloutPath, encoding: .utf8) else {
        return nil
    }

    let lines = text.split(whereSeparator: \.isNewline).map(String.init)

    for line in lines.reversed() {
        guard
            let data = line.data(using: .utf8),
            let object = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
            let candidate = speechCandidate(from: object),
            candidate.text.count <= maxSourceCharacters
        else {
            continue
        }

        return candidate
    }

    return nil
}

func speechCandidate(from object: [String: Any]) -> SpeechCandidate? {
    guard
        let topLevelType = object["type"] as? String,
        let payload = object["payload"] as? [String: Any]
    else {
        return nil
    }

    let timestamp = object["timestamp"] as? String ?? ""

    if
        topLevelType == "event_msg",
        payload["type"] as? String == "agent_message",
        let message = payload["message"] as? String
    {
        return candidate(timestamp: timestamp, source: "event_msg:agent_message", text: message)
    }

    if
        topLevelType == "response_item",
        payload["type"] as? String == "message",
        payload["role"] as? String == "assistant"
    {
        let content = payload["content"] as? [[String: Any]] ?? []
        let text = content.compactMap { item -> String? in
            if let text = item["text"] as? String {
                return text
            }
            if let outputText = item["output_text"] as? String {
                return outputText
            }
            return nil
        }.joined(separator: "\n")

        return candidate(timestamp: timestamp, source: "response_item:message", text: text)
    }

    return nil
}

func candidate(timestamp: String, source: String, text: String) -> SpeechCandidate? {
    let normalized = textForSource(text)
    guard normalized.count >= 2 else {
        return nil
    }

    return SpeechCandidate(timestamp: timestamp, source: source, text: normalized)
}

func textForSource(_ text: String) -> String {
    text
        .replacingOccurrences(of: "\u{FFFC}", with: "")
        .replacingOccurrences(of: "\r", with: "\n")
        .split(whereSeparator: \.isNewline)
        .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
        .filter { !$0.isEmpty }
        .joined(separator: " ")
        .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
        .trimmingCharacters(in: .whitespacesAndNewlines)
}

func speechText(from sourceText: String, options: Options) -> String {
    if !options.summarizeSpeech {
        return sourceText
    }

    return cuteSpeechSummary(from: sourceText)
}

func cuteSpeechSummary(from text: String) -> String {
    let prose = proseForSummary(text)
    guard !prose.isEmpty else {
        return "New message."
    }

    let sentence = firstUsefulSentence(in: prose)
    let limit = prose.count <= 80 ? 72 : 64
    let language = detectedLanguage(for: prose)
    let style = speechStyle(for: language)
    let core = speechCore(from: trimmedPhrase(sentence, maxCharacters: limit), style: style)

    guard !core.isEmpty else {
        return style.fallback
    }

    return cleanSpeechLine(variedSpeechLine(for: core, seed: prose, style: style), language: language)
}

func proseForSummary(_ text: String) -> String {
    var result = text

    result = result.replacingOccurrences(
        of: #"```[\s\S]*?```"#,
        with: " ",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"`([^`]+)`"#,
        with: "$1",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"\*\*([^*]+)\*\*"#,
        with: "$1",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"\[([^\]]+)\]\([^)]+\)"#,
        with: "$1",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"(^|\s)[-*]\s+"#,
        with: " ",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"\s+"#,
        with: " ",
        options: .regularExpression
    )

    return result.trimmingCharacters(in: .whitespacesAndNewlines)
}

func firstUsefulSentence(in text: String) -> String {
    let separators = CharacterSet(charactersIn: "。！？!?")
    let parts = text.components(separatedBy: separators)

    for part in parts {
        let trimmed = part.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.count >= 8 {
            return trimmed
        }
    }

    return text.trimmingCharacters(in: .whitespacesAndNewlines)
}

func trimmedPhrase(_ text: String, maxCharacters: Int) -> String {
    if text.count <= maxCharacters {
        return text
    }

    let index = text.index(text.startIndex, offsetBy: maxCharacters)
    return String(text[..<index]).trimmingCharacters(in: .whitespacesAndNewlines) + "..."
}

struct SpeechStyle {
    let fallback: String
    let templates: [String]
    let stripPrefixes: [String]
    let stripTerms: [String]
}

func speechStyle(for language: String) -> SpeechStyle {
    switch language {
    case "ja":
        return SpeechStyle(
            fallback: "新しいメッセージがあります。",
            templates: ["{text}"],
            stripPrefixes: [],
            stripTerms: []
        )
    case "en":
        return SpeechStyle(
            fallback: "New message.",
            templates: ["{text}"],
            stripPrefixes: ["ok", "okay", "got it"],
            stripTerms: []
        )
    default:
        return SpeechStyle(fallback: "New message.", templates: ["{text}"], stripPrefixes: [], stripTerms: [])
    }
}

func speechCore(from text: String, style: SpeechStyle) -> String {
    var result = text

    for term in style.stripTerms {
        result = result.replacingOccurrences(of: term, with: "")
    }
    result = result.replacingOccurrences(
        of: #"([、,])\s*([。！？!?])"#,
        with: "$2",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"^[、,。\s]+"#,
        with: "",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"[、,\s]+$"#,
        with: "",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"\s*[、,]\s*[、,]\s*"#,
        with: "、",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"\s+"#,
        with: " ",
        options: .regularExpression
    )

    return result.trimmingCharacters(in: .whitespacesAndNewlines)
}

func variedSpeechLine(for core: String, seed: String, style: SpeechStyle) -> String {
    var phrase = core
        .trimmingCharacters(in: CharacterSet(charactersIn: "、,。！？!?. "))
        .replacingOccurrences(
            of: #"[、,\s]+$"#,
            with: "",
            options: .regularExpression
        )
        .trimmingCharacters(in: .whitespacesAndNewlines)
    for prefix in style.stripPrefixes {
        let pattern = "^\(NSRegularExpression.escapedPattern(for: prefix))[、,\\s]+"
        phrase = phrase.replacingOccurrences(of: pattern, with: "", options: .regularExpression)
    }
    guard !phrase.isEmpty else {
        return style.fallback
    }

    let templates = style.templates.isEmpty ? ["{text}"] : style.templates
    let index = stableIndex(for: seed, count: templates.count)

    return templates[index].replacingOccurrences(of: "{text}", with: phrase)
}

func cleanSpeechLine(_ text: String, language: String) -> String {
    var result = text
    result = result.replacingOccurrences(
        of: #"[、,]\s*([。！？!?])"#,
        with: "$1",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"([。！？!?]){2,}"#,
        with: "$1",
        options: .regularExpression
    )
    result = result.replacingOccurrences(
        of: #"\s+"#,
        with: " ",
        options: .regularExpression
    )
    result = result.trimmingCharacters(in: CharacterSet(charactersIn: "、, \n\t"))
    if !result.hasSuffix("。") && !result.hasSuffix("！") && !result.hasSuffix("？") && !result.hasSuffix(".") && !result.hasSuffix("?") && !result.hasSuffix("!") {
        result += language == "ja" ? "。" : "."
    }
    return result
}

func stableIndex(for text: String, count: Int) -> Int {
    guard count > 0 else {
        return 0
    }

    let sum = text.unicodeScalars.reduce(0) { partial, scalar in
        (partial &+ Int(scalar.value)) % 9973
    }

    return sum % count
}

func normalizedKey(_ text: String) -> String {
    text
        .lowercased()
        .replacingOccurrences(of: #"\s+"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"[`*_#>\-・、。，．.。！？!?「」『』\[\]\(\)（）:：]"#, with: "", options: .regularExpression)
}

func speak(_ text: String, options: Options) {
    let engine = resolvedTTSEngine(for: text, options: options)

    switch engine {
    case "kokoro":
        if !speakWithKokoro(text, options: options) {
            print("[tts-fallback] Kokoro failed; using macOS say")
            speakWithSay(text, options: options)
        }
    case "voicebox", "voicevox":
        if !speakWithVoicebox(text, options: options) {
            print("[tts-fallback] VOICEVOX failed; using macOS say")
            speakWithSay(text, options: options)
        }
    case "say":
        speakWithSay(text, options: options)
    default:
        print("[tts-fallback] Unknown TTS engine '\(engine)'; using macOS say")
        speakWithSay(text, options: options)
    }
}

func resolvedTTSEngine(for text: String, options: Options) -> String {
    let configured = options.ttsEngine.lowercased()
    guard configured == "auto" || options.languageRoute else {
        return configured
    }

    let language = resolvedSpeechLanguage(for: text, options: options)
    switch language {
    case "ja":
        return "voicevox"
    case "en":
        return "kokoro"
    default:
        if configured == "auto" {
            return "say"
        }
        return configured
    }
}

func resolvedSpeechLanguage(for text: String, options: Options) -> String {
    let hint = options.speechLanguage.lowercased()
    if hint != "auto" {
        return hint
    }

    return detectedLanguage(for: text)
}

func detectedLanguage(for text: String) -> String {
    var japanese = 0
    var latin = 0
    var hangul = 0
    var cjk = 0

    for scalar in text.unicodeScalars {
        switch scalar.value {
        case 0x3040...0x30FF:
            japanese += 1
        case 0x4E00...0x9FFF:
            cjk += 1
        case 0xAC00...0xD7AF:
            hangul += 1
        case 0x0041...0x005A, 0x0061...0x007A:
            latin += 1
        default:
            continue
        }
    }

    if japanese > 0 || cjk >= 2 {
        return "ja"
    }
    if hangul > 0 {
        return "ko"
    }
    if latin >= 4 {
        return "en"
    }
    return "other"
}

func speakWithKokoro(_ text: String, options: Options) -> Bool {
    guard let scriptPath = siblingScriptPath("tts-kokoro.mjs") else {
        return false
    }

    let output = runProcess(
        executable: "/usr/bin/env",
        arguments: [
            "node",
            scriptPath,
            "--text", text,
            "--voice", options.kokoroVoice,
            "--dtype", options.kokoroDtype,
            "--device", options.kokoroDevice,
            "--play",
        ]
    )

    return output != nil
}

func speakWithVoicebox(_ text: String, options: Options) -> Bool {
    guard let scriptPath = siblingScriptPath("tts-voicebox.mjs") else {
        return false
    }

    var arguments = [
        "node",
        scriptPath,
        "--text", text,
        "--url", options.voiceboxURL,
        "--mode", options.voiceboxMode,
        "--speaker", options.voiceboxSpeaker,
        "--play",
    ]

    if let profile = options.voiceboxProfile {
        arguments.append(contentsOf: ["--profile-id", profile])
    }

    if let language = options.voiceboxLanguage {
        arguments.append(contentsOf: ["--language", language])
    }

    return runProcess(executable: "/usr/bin/env", arguments: arguments) != nil
}

func speakWithSay(_ text: String, options: Options) {
    _ = runProcess(
        executable: "/usr/bin/say",
        arguments: ["-v", options.voice, "-r", String(options.rate), text]
    )
}

func listVoices(options: Options) {
    let output: String?

    if options.ttsEngine == "kokoro", let scriptPath = siblingScriptPath("tts-kokoro.mjs") {
        output = runProcess(
            executable: "/usr/bin/env",
            arguments: [
                "node",
                scriptPath,
                "--list-voices",
                "--dtype", options.kokoroDtype,
                "--device", options.kokoroDevice,
            ]
        )
    } else if ["voicebox", "voicevox"].contains(options.ttsEngine), let scriptPath = siblingScriptPath("tts-voicebox.mjs") {
        output = runProcess(
            executable: "/usr/bin/env",
            arguments: [
                "node",
                scriptPath,
                "--list-voices",
                "--mode", options.voiceboxMode,
                "--url", options.voiceboxURL,
            ]
        )
    } else {
        output = runProcess(executable: "/usr/bin/say", arguments: ["-v", "?"])
    }

    if let output {
        print(output)
    }
}

func siblingScriptPath(_ fileName: String) -> String? {
    let scriptURL = URL(fileURLWithPath: CommandLine.arguments[0])
    let directory = scriptURL.deletingLastPathComponent()
    let candidate = directory.appendingPathComponent(fileName)

    if FileManager.default.fileExists(atPath: candidate.path) {
        return candidate.path
    }

    return nil
}

func runProcess(executable: String, arguments: [String], printOutputOnFailure: Bool = false) -> String? {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: executable)
    process.arguments = arguments

    let pipe = Pipe()
    process.standardOutput = pipe
    process.standardError = pipe

    do {
        try process.run()
    } catch {
        return nil
    }

    process.waitUntilExit()
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    let output = String(data: data, encoding: .utf8) ?? ""
    guard process.terminationStatus == 0 else {
        if printOutputOnFailure {
            let trimmed = output.trimmingCharacters(in: .whitespacesAndNewlines)
            if !trimmed.isEmpty {
                print(trimmed)
            }
        }
        return nil
    }

    return output
}

let options = parseOptions()

if options.listVoices {
    listVoices(options: options)
    exit(0)
}

var lastThread: ThreadSelection?
var lastSpokenKey: String?
var didSkipExisting = false

while true {
    guard let thread = resolveThread(options: options) else {
        print("[wait] Codex thread not found")
        if options.once { break }
        Thread.sleep(forTimeInterval: options.interval)
        continue
    }

    if thread != lastThread {
        print("[thread] \(thread.title) / \(thread.id)")
        print("[rollout] \(thread.rolloutPath)")
        lastThread = thread
        lastSpokenKey = nil
        didSkipExisting = false
    }

    if let candidate = readLatestSpeechCandidate(
        from: thread.rolloutPath,
        maxSourceCharacters: options.maxSourceCharacters
    ) {
        let key = normalizedKey(candidate.text)

        if options.skipExisting && !didSkipExisting {
            lastSpokenKey = key
            didSkipExisting = true
            print("[skip-existing] \(candidate.source) / \(candidate.timestamp)")
        } else if key != lastSpokenKey {
            let speech = speechText(from: candidate.text, options: options)
            print("[source] \(candidate.text)")
            print("[pet] \(speech)")
            lastSpokenKey = key

            if !options.dryRun {
                speak(speech, options: options)
            }
        }
    } else {
        print("[wait] speech candidate not found")
    }

    if options.once {
        break
    }

    Thread.sleep(forTimeInterval: options.interval)
}
