#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const preferredColumns = [
  "run",
  "provider",
  "total",
  "synthesis",
  "audioDuration",
  "rtf",
  "firstAudio",
  "play",
  "success",
  "platform",
  "arch",
  "node",
  "audio_query",
  "read_audio",
  "write_audio",
];

function main(argv = process.argv.slice(2), input = null) {
  const options = parseArgs(argv);
  if (options.help) {
    printUsage();
    return;
  }

  const text = input ?? (options.file ? readFileSync(options.file, "utf8") : readFileSync(0, "utf8"));
  const rows = latencyRowsFromText(text);
  if (rows.length === 0) {
    throw new Error("no [latency] lines found");
  }

  process.stdout.write(formatLatencyRows(rows, options.format));
}

if (process.argv[1] === scriptPath) {
  try {
    main();
  } catch (error) {
    console.error(`latency lines to table: ${error.message}`);
    process.exit(1);
  }
}

function parseArgs(argv) {
  const options = {
    file: null,
    format: "markdown",
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const takeValue = () => {
      const value = argv[i + 1];
      if (value == null || value.startsWith("--")) throw new Error(`${arg} requires a value`);
      i += 1;
      return value;
    };

    switch (arg) {
      case "--file":
        options.file = takeValue();
        break;
      case "--format":
        options.format = takeValue();
        if (!["markdown", "csv"].includes(options.format)) {
          throw new Error("--format must be markdown or csv");
        }
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
        if (options.file) throw new Error("expected at most one input file");
        options.file = arg;
    }
  }

  return options;
}

function printUsage() {
  console.log(`Usage:
  node scripts/latency-lines-to-table.mjs [options] [file]

Options:
  --file PATH           Read latency lines from a file instead of stdin
  --format markdown|csv Output format (default: markdown)
  --help                Show this help`);
}

function latencyRowsFromText(text) {
  return String(text)
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith("[latency] "))
    .map((line, index) => ({ run: index + 1, ...parseLatencyLine(line) }));
}

function parseLatencyLine(line) {
  const fields = {};
  for (const part of line.replace(/^\[latency\]\s+/, "").split(/\s+/)) {
    const separator = part.indexOf("=");
    if (separator <= 0) continue;
    fields[part.slice(0, separator)] = part.slice(separator + 1);
  }
  return fields;
}

function formatLatencyRows(rows, format) {
  const columns = latencyColumns(rows);
  return format === "csv" ? formatCSV(rows, columns) : formatMarkdown(rows, columns);
}

function latencyColumns(rows) {
  const present = new Set(rows.flatMap(row => Object.keys(row)));
  const ordered = preferredColumns.filter(column => present.has(column));
  const extras = [...present].filter(column => !ordered.includes(column)).sort();
  return [...ordered, ...extras];
}

function formatMarkdown(rows, columns) {
  const lines = [
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map(row => `| ${columns.map(column => markdownCell(row[column])).join(" | ")} |`),
  ];
  return `${lines.join("\n")}\n`;
}

function markdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|");
}

function formatCSV(rows, columns) {
  const lines = [
    columns.map(csvCell).join(","),
    ...rows.map(row => columns.map(column => csvCell(row[column])).join(",")),
  ];
  return `${lines.join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}

export {
  csvCell,
  formatLatencyRows,
  latencyColumns,
  latencyRowsFromText,
  main,
  parseArgs,
  parseLatencyLine,
};
