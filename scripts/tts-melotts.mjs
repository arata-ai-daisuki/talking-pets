#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { basename } from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);

async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const latencyProfile = startLatencyProfile(args["profile-latency"]);

  if (!args.health) {
    throw Object.assign(new Error("only --health is supported for MeloTTS candidate checks"), { exitCode: 2 });
  }

  const url = args.url ?? process.env.MELOTTS_URL;
  const command = args.command ?? process.env.MELOTTS_COMMAND;
  const timeoutMs = Number(args["timeout-ms"] ?? process.env.MELOTTS_TIMEOUT_MS ?? 3000);

  if (url) {
    await measureLatency(latencyProfile, "health", () => healthURL(url, timeoutMs));
    printLatencyProfile(latencyProfile, { provider: "melotts", success: true, health: true, runtime: "server" });
    return;
  }

  if (command) {
    measureLatency(latencyProfile, "health", () => healthCommand(command, args["health-arg"] ?? "--help", timeoutMs));
    printLatencyProfile(latencyProfile, { provider: "melotts", success: true, health: true, runtime: "command" });
    return;
  }

  printLatencyProfile(latencyProfile, { provider: "melotts", success: false, health: true, reason: "not_configured" });
  throw Object.assign(new Error("not_configured: set MELOTTS_URL or MELOTTS_COMMAND for an external MeloTTS runtime"), { exitCode: 2 });
}

if (process.argv[1] === scriptPath) {
  main().catch(error => {
    console.error(`tts-melotts: ${error?.message ?? String(error)}`);
    process.exit(error?.exitCode ?? 1);
  });
}

async function healthURL(url, timeoutMs) {
  const safeURL = safeURLForLog(url);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    const reason = error.name === "AbortError" ? "timeout" : "unavailable";
    throw Object.assign(new Error(`${reason}: unable to connect to ${safeURL}`), { exitCode: 1 });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw Object.assign(new Error(`unavailable: ${response.status} ${response.statusText} (${safeURL})`), { exitCode: 1 });
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    console.log(JSON.stringify(await response.json(), null, 2));
  } else {
    console.log(await response.text());
  }
}

function healthCommand(command, healthArg, timeoutMs) {
  const result = spawnSync(command, [healthArg], {
    encoding: "utf8",
    timeout: timeoutMs,
    shell: false,
  });

  if (result.error) {
    const reason = result.error.code === "ETIMEDOUT" ? "timeout" : "unavailable";
    throw Object.assign(new Error(`${reason}: ${basename(command)} health check failed`), { exitCode: 1 });
  }

  if (result.status !== 0) {
    throw Object.assign(new Error(`non_zero_exit: ${basename(command)} health check exited ${result.status}`), { exitCode: result.status ?? 1 });
  }

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (output) console.log(output);
}

function parseArgs(argv) {
  const result = {};
  const booleanFlags = new Set(["--health", "--profile-latency"]);
  const valueFlags = new Set(["--url", "--command", "--health-arg", "--timeout-ms"]);

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (booleanFlags.has(arg)) {
      result[arg.slice(2)] = true;
      continue;
    }

    if (!arg.startsWith("--")) {
      throw Object.assign(new Error(`Unexpected positional argument: ${arg}`), { exitCode: 2 });
    }

    if (!valueFlags.has(arg)) {
      throw Object.assign(new Error(`Unknown option: ${arg}`), { exitCode: 2 });
    }

    const value = argv[i + 1];
    if (value == null || booleanFlags.has(value) || valueFlags.has(value)) {
      throw Object.assign(new Error(`${arg} requires a value`), { exitCode: 2 });
    }
    result[arg.slice(2)] = value;
    i += 1;
  }

  return result;
}

function safeURLForLog(url) {
  try {
    const parsed = new URL(url);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return String(url).replace(/[?#].*$/, "?[redacted]");
  }
}

function startLatencyProfile(enabled) {
  if (!enabled) return null;
  return {
    startedAt: performance.now(),
    steps: [],
  };
}

function measureLatency(profile, name, operation) {
  if (!profile) return operation();

  const startedAt = performance.now();
  const record = () => {
    profile.steps.push({ name, ms: performance.now() - startedAt });
  };

  try {
    const result = operation();
    if (result && typeof result.finally === "function") {
      return result.finally(record);
    }
    record();
    return result;
  } catch (error) {
    record();
    throw error;
  }
}

function printLatencyProfile(profile, fields) {
  if (!profile) return;
  const totalMs = performance.now() - profile.startedAt;
  const steps = profile.steps.map(step => `${step.name}=${step.ms.toFixed(1)}ms`).join(" ");
  const metadata = Object.entries(fields).map(([key, value]) => `${key}=${value}`).join(" ");
  console.error(`[latency] total=${totalMs.toFixed(1)}ms ${steps} ${metadata}`.trim());
}

export { parseArgs, safeURLForLog };
