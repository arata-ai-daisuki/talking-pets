#!/usr/bin/env node

const REQUIRED_MAJOR = 22;

const version = process.versions.node;
const major = Number(version.split(".")[0]);
let failures = 0;

if (major >= REQUIRED_MAJOR) {
  ok(`Node.js version ${version}`);
} else {
  fail(`Node.js ${REQUIRED_MAJOR} or later is required; found ${version}`);
}

try {
  await import("node:sqlite");
  ok("node:sqlite available");
} catch (error) {
  fail(`node:sqlite is not available in this Node.js build; upgrade to a newer Node.js 22.x or 24.x release (${error.message})`);
}

if (failures > 0) {
  console.error(`node runtime: failed (${failures} issue${failures === 1 ? "" : "s"})`);
  process.exit(1);
}

console.log("node runtime: ok");

function ok(message) {
  console.log(`[ok] ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`[fail] ${message}`);
}
