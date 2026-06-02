#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { readLatestSpeechCandidate } from "./pet-rollout-monitor.mjs";

const scriptPath = fileURLToPath(import.meta.url);
const optionFlags = new Set([
  "--fixture",
  "--state-db",
  "--no-state",
  "--show-private-paths",
  "--help",
  "-h",
]);
let failures = 0;

async function main(argv = process.argv.slice(2)) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    console.error(`compat: ${error.message}`);
    process.exit(2);
  }

  failures = 0;

  for (const fixture of fixturePaths(options)) {
    checkFixture(fixture);
  }

  await checkStateDB(options);

  if (failures > 0) {
    console.error(`compat: failed (${failures} issue${failures === 1 ? "" : "s"})`);
    process.exit(1);
  }

  console.log("compat: ok");
}

if (process.argv[1] === scriptPath) {
  await main();
}

function fixturePaths(options) {
  if (options.fixtures.length > 0) return options.fixtures;
  return [
    "test/fixtures/assistant-rollout.jsonl",
    "test/fixtures/mixed-ja-en-rollout.jsonl",
    "test/fixtures/ko-zh-rollout.jsonl",
  ];
}

function checkFixture(path) {
  const result = readLatestSpeechCandidate(path, 4000);
  if (!result.candidate) {
    fail(`fixture speech candidate missing: ${result.message}`);
    return;
  }
  ok(`fixture rollout readable: ${path} (${result.candidate.source})`);

  const lines = readFileSync(path, "utf8").split(/\r?\n/).filter(Boolean);
  for (const [index, line] of lines.entries()) {
    try {
      JSON.parse(line);
    } catch (error) {
      fail(`fixture line ${index + 1} is not JSON: ${error.message}`);
    }
  }
}

async function checkStateDB(opts) {
  if (opts.noState) {
    ok("state DB check skipped (--no-state)");
    return;
  }

  const dbPath = opts.stateDB ?? defaultStateDBPath();
  if (!dbPath || !existsSync(dbPath)) {
    ok("state DB check skipped (state_5.sqlite not found)");
    return;
  }

  const { DatabaseSync } = await import("node:sqlite");
  let db;
  try {
    db = new DatabaseSync(dbPath, { readOnly: true });
    const columns = db.prepare("pragma table_info(threads)").all().map(row => row.name);
    for (const column of ["id", "title", "rollout_path"]) {
      if (!columns.includes(column)) {
        fail(`state DB threads.${column} column missing (${displayPrivatePath(dbPath, opts)})`);
      }
    }

    const row = db.prepare(`
      select id, rollout_path as rolloutPath
      from threads
      where rollout_path is not null and rollout_path != ''
      order by coalesce(updated_at_ms, updated_at, 0) desc
      limit 1
    `).get();

    if (!row) {
      ok("state DB has no rollout-backed threads yet");
      return;
    }

    if (!existsSync(row.rolloutPath)) {
      fail(`latest rollout_path does not exist: ${displayPrivatePath(row.rolloutPath, opts)}`);
      return;
    }

    const result = readLatestSpeechCandidate(row.rolloutPath, 4000, opts);
    if (!result.candidate) {
      fail(`latest rollout has no supported assistant speech candidate: ${redactPrivatePaths(result.message, [dbPath, row.rolloutPath], opts)}`);
      return;
    }

    ok(`state DB latest rollout readable (${row.id})`);
  } catch (error) {
    fail(`state DB compatibility check failed: ${redactPrivatePaths(error.message, [dbPath], opts)}`);
  } finally {
    db?.close();
  }
}

function defaultStateDBPath() {
  const codexHome = process.env.CODEX_HOME;
  if (codexHome) return join(codexHome, "state_5.sqlite");
  return join(homedir(), ".codex", "state_5.sqlite");
}

function parseArgs(argv) {
  const result = { fixtures: [], stateDB: null, noState: false, showPrivatePaths: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => {
      const next = argv[i + 1];
      if (next == null || optionFlags.has(next)) throw new Error(`${arg} requires a value`);
      i += 1;
      return next;
    };

    if (arg === "--fixture") result.fixtures.push(value());
    else if (arg === "--state-db") result.stateDB = value();
    else if (arg === "--no-state") result.noState = true;
    else if (arg === "--show-private-paths") result.showPrivatePaths = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/check-codex-compat.mjs [--fixture PATH] [--state-db PATH] [--no-state] [--show-private-paths]");
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return result;
}

function displayPrivatePath(path, opts = {}) {
  if (opts.showPrivatePaths) return path;
  return "<redacted path>";
}

function redactPrivatePaths(message, paths = [], opts = {}) {
  if (opts.showPrivatePaths) return message;
  let result = String(message ?? "");
  for (const path of paths.filter(Boolean)) {
    result = result.split(path).join("<redacted path>");
  }
  return result;
}

function ok(message) {
  console.log(`[ok] ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`[fail] ${message}`);
}

export { checkFixture, displayPrivatePath, fixturePaths, main, redactPrivatePaths };
