#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { arch, cpus, freemem, platform, release, totalmem } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(scriptDir);
const scriptPath = fileURLToPath(import.meta.url);

function main(argv = process.argv.slice(2)) {
  const options = parseOptions(argv);
  const command = benchmarkCommand(options);
  const runs = [];

  for (let i = 0; i < options.runs; i += 1) {
    const result = spawnSync(command[0], command.slice(1), {
      cwd: repoRoot,
      encoding: "utf8",
    });
    const output = `${result.stdout || ""}${result.stderr || ""}`;
    const latency = parseLatencyLine(output);

    if (result.status !== 0 || !latency) {
      console.error(`Run ${i + 1} failed.`);
      if (result.stdout) console.error(result.stdout.trim());
      if (result.stderr) console.error(result.stderr.trim());
      process.exit(result.status || 1);
    }

    runs.push(latency);
  }

  const summary = summarizeRuns(runs, command);
  const output = formatSummary(summary, options.format);
  if (options.out) writeFileSync(options.out, output);
  process.stdout.write(output);
}

if (process.argv[1] === scriptPath) {
  main();
}

function benchmarkCommand(options) {
  return [
    process.execPath,
    "--no-warnings",
    join(scriptDir, "pet-rollout-monitor.mjs"),
    "--once",
    "--dry-run",
    "--profile-latency",
    "--rollout",
    options.rollout,
  ];
}

function parseOptions(argv) {
  const result = {
    runs: 10,
    out: null,
    rollout: join(repoRoot, "test", "fixtures", "assistant-rollout.jsonl"),
    format: "json",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const takeValue = () => {
      const value = argv[i + 1];
      if (value == null) throw new Error(`${arg} requires a value`);
      i += 1;
      return value;
    };

    switch (arg) {
      case "--runs":
        result.runs = parseRuns(takeValue());
        break;
      case "--rollout":
        result.rollout = takeValue();
        break;
      case "--out":
        result.out = takeValue();
        break;
      case "--format":
        result.format = takeValue();
        if (!["json", "markdown", "csv"].includes(result.format)) {
          throw new Error("--format must be json, markdown, or csv");
        }
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return result;
}

function printUsage() {
  console.log(`Usage:
  node scripts/latency-benchmark.mjs [options]

Options:
  --runs N        Number of dry-run samples (default: 10)
  --rollout PATH Rollout JSONL fixture or log to measure
  --format FORMAT json, markdown, or csv (default: json)
  --out PATH      Write the formatted summary to a file
  --help         Show this help`);
}

function parseRuns(value) {
  const runs = Number(value);
  if (!Number.isInteger(runs) || runs < 1) {
    throw new Error("--runs must be a positive integer");
  }
  return runs;
}

function parseLatencyLine(output) {
  const line = output
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith("[latency] "));
  if (!line) return null;

  const values = {};
  for (const part of line.replace("[latency] ", "").split(/\s+/)) {
    const [key, rawValue] = part.split("=");
    if (!key || rawValue == null) continue;
    values[key] = parseLatencyValue(rawValue);
  }
  return values;
}

function parseLatencyValue(value) {
  if (value.endsWith("ms")) return Number(value.slice(0, -2));
  if (value === "true") return true;
  if (value === "false") return false;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
}

function summarizeRuns(runs, command = benchmarkCommand(parseOptions([]))) {
  const metricNames = [...new Set(runs.flatMap((run) => Object.keys(run)))].filter((name) => {
    return runs.some((run) => typeof run[name] === "number");
  });

  const metrics = {};
  for (const name of metricNames) {
    const values = runs
      .map((run) => run[name])
      .filter((value) => typeof value === "number")
      .sort((left, right) => left - right);
    metrics[name] = {
      minMs: round(values[0]),
      p50Ms: round(percentile(values, 0.5)),
      p95Ms: round(percentile(values, 0.95)),
      maxMs: round(values[values.length - 1]),
    };
  }

  return {
    runs: runs.length,
    command: command.map((part) => part.replace(repoRoot, ".")).join(" "),
    firstAudio: {
      status: "not_measured",
      reason: "dry-run benchmark does not play audio or observe audible playback start",
    },
    device: deviceInfo(),
    metrics,
  };
}

function deviceInfo() {
  const cpuList = cpus();
  const cpu = cpuList[0];
  return {
    platform: platform(),
    release: release(),
    arch: arch(),
    cpuModel: cpu?.model ?? "unknown",
    cpuCount: cpuList.length,
    totalMemoryGB: round(totalmem() / 1024 / 1024 / 1024),
    freeMemoryGB: round(freemem() / 1024 / 1024 / 1024),
    node: process.version,
  };
}

function formatSummary(summary, format) {
  if (format === "csv") return formatCSV(summary);
  if (format === "markdown") return formatMarkdown(summary);
  return `${JSON.stringify(summary, null, 2)}\n`;
}

function summaryRows(summary) {
  return Object.entries(summary.metrics).map(([metric, values]) => ({
    metric,
    minMs: values.minMs,
    p50Ms: values.p50Ms,
    p95Ms: values.p95Ms,
    maxMs: values.maxMs,
    runs: summary.runs,
    firstAudio: summary.firstAudio.status,
    platform: summary.device.platform,
    arch: summary.device.arch,
    cpuModel: summary.device.cpuModel,
    node: summary.device.node,
  }));
}

function formatMarkdown(summary) {
  const columns = ["metric", "minMs", "p50Ms", "p95Ms", "maxMs", "runs", "firstAudio", "platform", "arch", "node"];
  const rows = summaryRows(summary);
  return [
    `Command: \`${summary.command}\``,
    "",
    `First audio: ${summary.firstAudio.status} (${summary.firstAudio.reason})`,
    "",
    `Device: ${summary.device.platform} ${summary.device.release} / ${summary.device.arch} / ${summary.device.cpuModel} / Node ${summary.device.node}`,
    "",
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map(row => `| ${columns.map(column => markdownCell(row[column])).join(" | ")} |`),
  ].join("\n") + "\n";
}

function formatCSV(summary) {
  const columns = ["metric", "minMs", "p50Ms", "p95Ms", "maxMs", "runs", "firstAudio", "platform", "release", "arch", "cpuModel", "node", "command"];
  const rows = summaryRows(summary).map(row => ({
    ...row,
    release: summary.device.release,
    command: summary.command,
  }));
  return [
    columns.map(csvCell).join(","),
    ...rows.map(row => columns.map(column => csvCell(row[column])).join(",")),
  ].join("\n") + "\n";
}

function markdownCell(value) {
  return String(value ?? "").replaceAll("|", "\\|");
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}

function percentile(values, rank) {
  if (values.length === 1) return values[0];
  const index = (values.length - 1) * rank;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return values[lower];
  return values[lower] + (values[upper] - values[lower]) * (index - lower);
}

function round(value) {
  return Math.round(value * 10) / 10;
}

export {
  deviceInfo,
  formatSummary,
  parseLatencyLine,
  parseLatencyValue,
  parseRuns,
  summarizeRuns,
};
