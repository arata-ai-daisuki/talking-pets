#!/usr/bin/env swift

import AppKit
import CoreGraphics
import Darwin
import Foundation
import Vision

struct Options {
    var interval: TimeInterval = 1.2
    var voice = "Kyoko"
    var rate = 185
    var minCharacters = 3
    var maxCharacters = 420
    var minJapaneseCharacters = 6
    var settleReadsAfterMove = 2
    var summarizeSpeech = true
    var dryRun = false
    var noiseFilter = true
    var listVoices = false
    var once = false
    var saveImage: URL?
    var region: CGRect?
    var useStateRegion = true
    var statePadding: CGFloat = 12
}

func printUsage() {
    print("""
    Usage:
      swift scripts/pet-ocr-monitor.swift [options]

    Options:
      --voice <name>        macOS say voice name. Default: Kyoko
      --rate <number>       macOS say rate. Default: 185
      --interval <seconds>  Poll interval. Default: 1.2
      --region x,y,w,h      Capture region. Overrides automatic pet tracking
      --no-state-region     Do not follow Codex avatar overlay state
      --state-padding <px>  Padding around detected pet tray. Default: 12
      --max-chars <number>  Skip OCR text longer than this. Default: 420
      --settle-reads <n>    Skip this many reads after pet moves. Default: 2
      --no-summary          Speak the extracted bubble text without cute summary
      --dry-run             Print OCR text without speaking
      --no-noise-filter     Speak raw OCR text, including UI-like text
      --once                Capture once and exit
      --save-image <path>   Save the captured crop for region tuning
      --list-voices         Print available macOS voices
      --help                Show this help
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
        case "--rate":
            guard let value = args.first, let rate = Int(value) else { fatalError("--rate requires a number") }
            args.removeFirst()
            options.rate = rate
        case "--interval":
            guard let value = args.first, let interval = TimeInterval(value) else { fatalError("--interval requires a number") }
            args.removeFirst()
            options.interval = interval
        case "--max-chars":
            guard let value = args.first, let maxCharacters = Int(value) else { fatalError("--max-chars requires a number") }
            args.removeFirst()
            options.maxCharacters = maxCharacters
        case "--settle-reads":
            guard let value = args.first, let settleReads = Int(value) else { fatalError("--settle-reads requires a number") }
            args.removeFirst()
            options.settleReadsAfterMove = max(0, settleReads)
        case "--no-summary":
            options.summarizeSpeech = false
        case "--region":
            guard let value = args.first else { fatalError("--region requires x,y,w,h") }
            args.removeFirst()
            options.region = parseRegion(value)
        case "--no-state-region":
            options.useStateRegion = false
        case "--state-padding":
            guard let value = args.first, let padding = Double(value) else { fatalError("--state-padding requires a number") }
            args.removeFirst()
            options.statePadding = CGFloat(max(0, padding))
        case "--dry-run":
            options.dryRun = true
        case "--no-noise-filter":
            options.noiseFilter = false
        case "--once":
            options.once = true
        case "--save-image":
            guard !args.isEmpty else { fatalError("--save-image requires a path") }
            options.saveImage = URL(fileURLWithPath: args.removeFirst())
        case "--list-voices":
            options.listVoices = true
        default:
            fatalError("Unknown option: \(arg)")
        }
    }

    return options
}

func parseRegion(_ value: String) -> CGRect {
    let parts = value
        .split(separator: ",")
        .compactMap { Double($0.trimmingCharacters(in: .whitespaces)) }

    guard parts.count == 4, parts[2] > 0, parts[3] > 0 else {
        fatalError("--region must be x,y,w,h")
    }

    return CGRect(x: parts[0], y: parts[1], width: parts[2], height: parts[3])
}

func defaultRegion() -> CGRect {
    let displayBounds = mainDisplayBounds()
    let width: CGFloat = min(430, displayBounds.width)
    let height: CGFloat = min(340, displayBounds.height)
    let inset: CGFloat = 12

    return CGRect(
        x: displayBounds.maxX - width - inset,
        y: displayBounds.maxY - height - inset,
        width: width,
        height: height
    )
}

struct RegionSelection {
    let region: CGRect
    let source: String
}

func resolveRegion(options: Options) -> RegionSelection {
    if let region = options.region {
        return RegionSelection(region: clamp(region, to: mainDisplayBounds()), source: "manual")
    }

    if options.useStateRegion, let region = codexAvatarTrayRegion(padding: options.statePadding) {
        return RegionSelection(region: region, source: "codex-avatar-state")
    }

    return RegionSelection(region: defaultRegion(), source: "bottom-right fallback")
}

func codexAvatarTrayRegion(padding: CGFloat) -> CGRect? {
    guard
        let stateURL = codexGlobalStateURL(),
        let data = try? Data(contentsOf: stateURL),
        let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
        let rawBounds = json["electron-avatar-overlay-bounds"] as? [String: Any]
    else {
        return nil
    }

    let bounds = boundsForCurrentDisplay(from: rawBounds)

    guard
        let overlayX = number(bounds["x"]),
        let overlayY = number(bounds["y"]),
        let tray = bounds["tray"] as? [String: Any],
        let trayLeft = number(tray["left"]),
        let trayTop = number(tray["top"]),
        let trayWidth = number(tray["width"]),
        let trayHeight = number(tray["height"]),
        trayWidth > 0,
        trayHeight > 0
    else {
        return nil
    }

    let displayBounds = displayBounds(from: bounds) ?? mainDisplayBounds()
    let region = CGRect(
        x: overlayX + trayLeft - padding,
        y: overlayY + trayTop - padding,
        width: trayWidth + padding * 2,
        height: trayHeight + padding * 2
    )

    return clamp(region, to: displayBounds)
}

func codexGlobalStateURL() -> URL? {
    let environment = ProcessInfo.processInfo.environment

    if let codexHome = environment["CODEX_HOME"], !codexHome.isEmpty {
        return URL(fileURLWithPath: codexHome)
            .appendingPathComponent(".codex-global-state.json")
    }

    guard let home = environment["HOME"], !home.isEmpty else {
        return nil
    }

    return URL(fileURLWithPath: home)
        .appendingPathComponent(".codex")
        .appendingPathComponent(".codex-global-state.json")
}

func boundsForCurrentDisplay(from bounds: [String: Any]) -> [String: Any] {
    let display = mainDisplayBounds()
    let key = "\(Int(display.width))x\(Int(display.height))"

    if
        let byResolution = bounds["byResolution"] as? [String: Any],
        let current = byResolution[key] as? [String: Any]
    {
        return current
    }

    return bounds
}

func displayBounds(from bounds: [String: Any]) -> CGRect? {
    guard
        let display = bounds["displayBounds"] as? [String: Any],
        let x = number(display["x"]),
        let y = number(display["y"]),
        let width = number(display["width"]),
        let height = number(display["height"]),
        width > 0,
        height > 0
    else {
        return nil
    }

    return CGRect(x: x, y: y, width: width, height: height)
}

func number(_ value: Any?) -> CGFloat? {
    if let number = value as? NSNumber {
        return CGFloat(truncating: number)
    }

    if let double = value as? Double {
        return CGFloat(double)
    }

    if let int = value as? Int {
        return CGFloat(int)
    }

    return nil
}

func clamp(_ rect: CGRect, to bounds: CGRect) -> CGRect {
    let minX = max(bounds.minX, rect.minX)
    let minY = max(bounds.minY, rect.minY)
    let maxX = min(bounds.maxX, rect.maxX)
    let maxY = min(bounds.maxY, rect.maxY)

    guard maxX > minX, maxY > minY else {
        return rect
    }

    return CGRect(x: minX, y: minY, width: maxX - minX, height: maxY - minY)
}

func regionDescription(_ selection: RegionSelection) -> String {
    let region = selection.region
    return "x=\(Int(region.origin.x)) y=\(Int(region.origin.y)) w=\(Int(region.width)) h=\(Int(region.height)) (\(selection.source))"
}

func mainDisplayBounds() -> CGRect {
    let cgBounds = CGDisplayBounds(CGMainDisplayID())
    if cgBounds.width > 0 && cgBounds.height > 0 {
        return cgBounds
    }

    if let screen = NSScreen.main ?? NSScreen.screens.first {
        return screen.frame
    }

    return CGRect(x: 0, y: 0, width: 1440, height: 900)
}

@discardableResult
func run(_ launchPath: String, _ arguments: [String], stdout: Pipe? = nil, errorPipe: Pipe? = nil) -> Int32 {
    let process = Process()
    process.executableURL = URL(fileURLWithPath: launchPath)
    process.arguments = arguments
    process.standardOutput = stdout ?? FileHandle.nullDevice
    process.standardError = errorPipe ?? FileHandle.nullDevice

    do {
        try process.run()
        process.waitUntilExit()
        return process.terminationStatus
    } catch {
        fputs("Failed to run \(launchPath): \(error)\n", stderr)
        return 1
    }
}

func capture(region: CGRect, outputURL: URL) -> Bool {
    let rect = [
        Int(region.origin.x),
        Int(region.origin.y),
        Int(region.width),
        Int(region.height),
    ].map(String.init).joined(separator: ",")

    return run("/usr/sbin/screencapture", ["-x", "-R", rect, outputURL.path]) == 0
}

func recognizeLines(in imageURL: URL) -> [String] {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = ["ja-JP", "en-US"]

    let handler = VNImageRequestHandler(url: imageURL, options: [:])

    do {
        try handler.perform([request])
    } catch {
        fputs("OCR failed: \(error)\n", stderr)
        return []
    }

    let observations = request.results ?? []
    return observations
        .sorted { lhs, rhs in
            let yDiff = abs(lhs.boundingBox.midY - rhs.boundingBox.midY)
            if yDiff > 0.025 {
                return lhs.boundingBox.midY > rhs.boundingBox.midY
            }
            return lhs.boundingBox.minX < rhs.boundingBox.minX
        }
        .compactMap { $0.topCandidates(1).first?.string }
        .map(normalize)
        .filter { !$0.isEmpty }
}

struct SpeechCandidate {
    let sourceText: String
    let speechText: String
    let hasBubbleAnchor: Bool
}

func recognizeSpeech(in imageURL: URL, options: Options) -> SpeechCandidate {
    let lines = recognizeLines(in: imageURL)
    let sourceText = textForSpeech(from: lines)
    let summary = options.summarizeSpeech ? cuteSpeechSummary(from: sourceText) : sourceText
    let speechText = summary.count >= options.minCharacters ? summary : sourceText

    return SpeechCandidate(
        sourceText: sourceText,
        speechText: speechText,
        hasBubbleAnchor: hasBubbleAnchor(in: lines)
    )
}

func textForSpeech(from lines: [String]) -> String {
    let contentLines = lines.count <= 1 ? lines : Array(lines.dropFirst())
    return cleanSpeechText(normalize(contentLines.joined(separator: " ")))
}

func hasBubbleAnchor(in lines: [String]) -> Bool {
    return lines.contains { line in
        let patterns = [
            #"(?i)Codex\s*pet\s*を\s*喋らせる"#,
            #"(?i)Codexpet\s*を\s*喋らせる"#,
            #"pet\s*を\s*喋らせる"#,
        ]

        return patterns.contains { pattern in
            line.range(of: pattern, options: .regularExpression) != nil
        }
    }
}

func cleanSpeechText(_ rawText: String) -> String {
    var text = rawText

    let removePatterns = [
        #"(?i)\bCodex\s*petを喋らせる\b"#,
        #"(?i)\bCodexpetを喋らせる\b"#,
        #"(?i)\bpetを喋らせる\b"#,
        #"認\s*"#,
        #"\bC\s*考え中\b"#,
        #"考え中"#,
        #"[Xx×✕]\s*$"#,
        #"\s+[-–—]?\d{1,3}\s*$"#,
    ]

    for pattern in removePatterns {
        text = text.replacingOccurrences(of: pattern, with: "", options: .regularExpression)
    }

    return normalize(text)
}

func cuteSpeechSummary(from rawText: String) -> String {
    let text = proseForSummary(rawText)
    guard !text.isEmpty else {
        return ""
    }

    let lowered = text.lowercased()

    if text.contains("直した") || text.contains("対応した") || text.contains("入れた") || text.contains("修正") {
        return "マスター、そこ直したよ。もう一回だけ試してみてね。"
    }

    if text.contains("原因") || text.contains("理由") {
        return "マスター、原因はだいたい見えてきたよ。落ち着いて整えるね。"
    }

    if text.contains("エラー") || text.contains("失敗") || text.contains("引っかか") {
        return "マスター、ここで引っかかってるみたい。あたしが切り分けるね。"
    }

    if text.contains("確認") || text.contains("試して") || text.contains("見て") || lowered.contains("./scripts") || lowered.contains("cd ") {
        return "マスター、まずはこの手順で試してみてね。"
    }

    if text.contains("OK") || text.contains("できた") || text.contains("良さそう") || text.contains("いい感じ") {
        return "マスター、いい感じ。ここまでちゃんと動いてるよ。"
    }

    var phrase = firstSentence(from: text)
    phrase = phrase
        .replacingOccurrences(of: "マスター", with: "")
        .replacingOccurrences(of: #"^(うん|はい|了解|結論)[、,：:\s]*"#, with: "", options: .regularExpression)
        .trimmingCharacters(in: .whitespacesAndNewlines)

    phrase = trimmedPhrase(phrase, limit: 44)

    guard !phrase.isEmpty else {
        return "マスター、吹き出しの内容を確認したよ。"
    }

    if phrase.hasSuffix("。") || phrase.hasSuffix("！") || phrase.hasSuffix("？") {
        return "マスター、\(phrase)"
    }

    return "マスター、\(phrase)だよ。"
}

func proseForSummary(_ rawText: String) -> String {
    var text = rawText
        .replacingOccurrences(of: #"```.*$"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"`[^`]+`"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"https?://\S+"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"(?i)\bcd\s+/\S.*$"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"(?i)\./scripts/\S.*$"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"(?i)scripts/pet-ocr-monitor\.command.*$"#, with: "", options: .regularExpression)

    text = normalize(text)
    return text
}

func firstSentence(from text: String) -> String {
    let delimiters: Set<Character> = ["。", "！", "!", "？", "?"]

    for index in text.indices {
        if delimiters.contains(text[index]) {
            return String(text[...index])
        }
    }

    return text
}

func trimmedPhrase(_ text: String, limit: Int) -> String {
    guard text.count > limit else {
        return text
    }

    let index = text.index(text.startIndex, offsetBy: limit)
    return String(text[..<index]).trimmingCharacters(in: .whitespacesAndNewlines) + "..."
}

func normalize(_ text: String) -> String {
    var text = text
        .replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
        .trimmingCharacters(in: .whitespacesAndNewlines)

    let noisePatterns = [
        #"^\d+[:：]\d+\s*"#,
        #"(?i)\b(Codex|OpenAI)\b"#,
        #"^\W+$"#,
    ]

    for pattern in noisePatterns {
        text = text.replacingOccurrences(of: pattern, with: "", options: .regularExpression)
    }

    return text.trimmingCharacters(in: .whitespacesAndNewlines)
}

func isLikelyNoise(_ text: String, options: Options) -> Bool {
    let lowered = text.lowercased()
    let blockedFragments = [
        "--dry-run",
        "--save-image",
        "/tmp/",
        ".png",
        "talking-pets",
        "ing-pets",
        "ring-pets",
        "localstorage",
        "selected:",
        "voice:",
        "ja-jp",
        "ja_jp",
        "kyoko",
        "yoko",
        "5.5 高",
        "5.5高",
        "新着",
        "回視聴",
        "時間前",
        "か月前",
        "チャンネル",
        "short",
        "youtube",
        "ガンダム",
        "lki",
        "jko",
    ]

    if blockedFragments.contains(where: { lowered.contains($0) }) {
        return true
    }

    if !containsJapanese(text) {
        return true
    }

    if japaneseCharacterCount(text) < options.minJapaneseCharacters {
        return true
    }

    if text.range(of: #"[-–—]{2,}|/[A-Za-z0-9_.-]+|[A-Za-z]{4,}"#, options: .regularExpression) != nil {
        return japaneseCharacterCount(text) < 8
    }

    return false
}

func containsJapanese(_ text: String) -> Bool {
    return japaneseCharacterCount(text) > 0
}

func japaneseCharacterCount(_ text: String) -> Int {
    return text.filter { character in
        return character.unicodeScalars.contains { scalar in
            return (0x3040...0x30FF).contains(Int(scalar.value)) ||
                (0x4E00...0x9FFF).contains(Int(scalar.value))
        }
    }.count
}

func dedupeKey(_ text: String) -> String {
    let japaneseOnly = text.compactMap { character -> String? in
        if character.unicodeScalars.contains(where: { scalar in
            return (0x3040...0x30FF).contains(Int(scalar.value)) ||
                (0x4E00...0x9FFF).contains(Int(scalar.value))
        }) {
            return String(character)
        }
        return nil
    }.joined()

    if japaneseOnly.count >= 4 {
        return japaneseOnly
    }

    return text.lowercased()
        .replacingOccurrences(of: #"\s+"#, with: "", options: .regularExpression)
        .replacingOccurrences(of: #"[[:punct:]、。，．・：:「」『』（）()\[\]【】*#_`~…!！?？×✕xX]"#, with: "", options: .regularExpression)
}

func bigrams(_ text: String) -> Set<String> {
    let chars = Array(text)
    guard chars.count >= 2 else { return Set(chars.map(String.init)) }

    var result = Set<String>()
    for index in 0..<(chars.count - 1) {
        result.insert(String(chars[index]) + String(chars[index + 1]))
    }
    return result
}

func similarity(_ lhs: String, _ rhs: String) -> Double {
    let left = bigrams(lhs)
    let right = bigrams(rhs)
    guard !left.isEmpty && !right.isEmpty else { return lhs == rhs ? 1 : 0 }

    let intersection = left.intersection(right).count
    let union = left.union(right).count
    return Double(intersection) / Double(union)
}

func isRecentlySpoken(_ text: String, recentKeys: [String]) -> Bool {
    let key = dedupeKey(text)
    guard key.count >= 8 else { return recentKeys.contains(key) }

    return recentKeys.contains { previous in
        if previous == key { return true }
        if commonPrefixCount(previous, key) >= 18 {
            return true
        }
        if previous.count >= 12 && key.count >= 12 && (previous.contains(key) || key.contains(previous)) {
            return true
        }
        return similarity(previous, key) >= 0.62
    }
}

func commonPrefixCount(_ lhs: String, _ rhs: String) -> Int {
    var count = 0
    for (left, right) in zip(lhs, rhs) {
        guard left == right else { break }
        count += 1
    }
    return count
}

func speak(_ text: String, options: Options) {
    guard !options.dryRun else { return }
    _ = run("/usr/bin/say", ["-v", options.voice, "-r", String(options.rate), text])
}

func listVoices() {
    let pipe = Pipe()
    _ = run("/usr/bin/say", ["-v", "?"], stdout: pipe)
    pipe.fileHandleForWriting.closeFile()
    let data = pipe.fileHandleForReading.readDataToEndOfFile()
    if let output = String(data: data, encoding: .utf8) {
        print(output)
    }
}

let options = parseOptions()

if options.listVoices {
    listVoices()
    exit(0)
}

let tempURL = URL(fileURLWithPath: NSTemporaryDirectory())
    .appendingPathComponent("talking-pet-ocr-\(UUID().uuidString).png")

defer {
    try? FileManager.default.removeItem(at: tempURL)
}

var activeRegionDescription = ""
let initialRegion = resolveRegion(options: options)
activeRegionDescription = regionDescription(initialRegion)

print("Watching region \(activeRegionDescription)")
print(options.dryRun ? "Dry run: OCR only" : "Voice: \(options.voice), rate: \(options.rate)")
print("Press Ctrl-C to stop.")
fflush(stdout)

var lastText = ""
var recentKeys: [String] = []
var settleReadsRemaining = 0

while true {
    autoreleasepool {
        let selection = resolveRegion(options: options)
        let description = regionDescription(selection)

        if description != activeRegionDescription {
            activeRegionDescription = description
            settleReadsRemaining = options.settleReadsAfterMove
            print("[region] \(description)")
            fflush(stdout)
        }

        if settleReadsRemaining > 0 {
            if options.dryRun {
                print("[skip] region settling")
                fflush(stdout)
            }
            settleReadsRemaining -= 1
            return
        }

        guard capture(region: selection.region, outputURL: tempURL) else {
            fputs("Screen capture failed. Check Screen Recording permission for your terminal/Codex.\n", stderr)
            return
        }

        if let saveImage = options.saveImage {
            do {
                try? FileManager.default.removeItem(at: saveImage)
                try FileManager.default.copyItem(at: tempURL, to: saveImage)
                print("Saved capture: \(saveImage.path)")
            } catch {
                fputs("Failed to save capture image: \(error)\n", stderr)
            }
        }

        let speech = recognizeSpeech(in: tempURL, options: options)
        let text = speech.speechText

        if text.count >= options.minCharacters && text != lastText {
            if options.noiseFilter && !speech.hasBubbleAnchor {
                if options.dryRun {
                    print("[skip] no bubble anchor: \(text)")
                    fflush(stdout)
                }
                return
            }

            if text.count > options.maxCharacters {
                if options.dryRun {
                    print("[skip] too long: \(text)")
                    fflush(stdout)
                }
                return
            }

            if options.noiseFilter && isLikelyNoise(speech.sourceText, options: options) {
                if options.dryRun {
                    print("[skip] \(text)")
                    fflush(stdout)
                }
                return
            }

            if isRecentlySpoken(text, recentKeys: recentKeys) {
                if options.dryRun {
                    print("[skip] repeated: \(text)")
                    fflush(stdout)
                }
                return
            }

            lastText = text
            recentKeys.append(dedupeKey(text))
            recentKeys = Array(recentKeys.suffix(20))
            print("[pet] \(text)")
            fflush(stdout)
            speak(text, options: options)
        }
    }

    if options.once {
        break
    }

    Thread.sleep(forTimeInterval: options.interval)
}
