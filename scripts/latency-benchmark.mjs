#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = dirname(scriptDir);
const options = parseOptions(process.argv.slice(2));

const command = [
  process.execPath,
  "--no-warnings",
  join(scriptDir, "pet-rollout-monitor.mjs"),
  "--once",
  "--dry-run",
  "--profile-latency",
  "--rollout",
  options.rollout,
];

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

const summary = summarizeRuns(runs);
const json = JSON.stringify(summary, null, 2);
if (options.out) writeFileSync(options.out, `${json}\n`);
console.log(json);

function parseOptions(argv) {
  const result = {
    runs: 10,
    out: null,
    rollout: join(repoRoot, "test", "fixtures", "assistant-rollout.jsonl"),
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
        result.runs = Math.max(1, Number(takeValue()));
        break;
      case "--rollout":
        result.rollout = takeValue();
        break;
      case "--out":
        result.out = takeValue();
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
  --out PATH      Write the JSON summary to a file
  --help         Show this help`);
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

function summarizeRuns(runs) {
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
    metrics,
  };
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
