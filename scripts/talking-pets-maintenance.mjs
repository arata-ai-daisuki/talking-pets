#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

const sections = [
  {
    title: "Keep by default",
    rows: [
      ["Repository files", ".", "Updated by git/release/package reinstall; remove only when retiring the project."],
      ["User config", ".talking-pets.local.env", "Preserve before update; delete only when intentionally removing local settings."],
      ["Codex state", "Codex app data", "Read-only from Talking Pets; never delete as part of Talking Pets uninstall."],
    ],
  },
  {
    title: "Removable with confirmation",
    rows: [
      ["npm dependencies", "node_modules/", "Can be recreated with npm ci; confirm repo root before deleting."],
      ["Kokoro cache", "~/.cache/talking-pets/transformers", "Optional cleanup; deleting may trigger model download later."],
      ["Generated evidence", "user-selected files", "Review and sanitize before deleting; may be release proof."],
    ],
  },
  {
    title: "User-managed external runtimes",
    rows: [
      ["VOICEVOX / Voicebox", "external app/server", "Use its own update/uninstall docs; Talking Pets should not remove it."],
      ["Irodori TTS Server", "external server/runtime", "Use Irodori runtime docs; Talking Pets only connects when configured."],
      ["MeloTTS", "Python/Docker/runtime path", "Health-check only here; runtime cache ownership is external."],
      ["OpenAI-compatible local endpoint", "external local server", "Opt-in design-only; do not download/install from Talking Pets yet."],
    ],
  },
  {
    title: "Never infer",
    rows: [
      ["API keys/secrets", "environment or user secret store", "Do not create, print, validate, or delete inferred secret locations."],
      ["Remote generated audio cache", "none by default", "Future cache must be explicit opt-in with documented cleanup."],
    ],
  },
  {
    title: "Rollback",
    rows: [
      ["Before update", "cp .talking-pets.local.env .talking-pets.local.env.backup", "Keep a config backup before rerunning installers."],
      ["After update", "npm run check:all", "Run the full local gate before sharing results."],
      ["Provider recheck", "npm run monitor:node -- --list-provider-capabilities", "Confirm provider boundaries after update."],
    ],
  },
];

function main(argv = process.argv.slice(2)) {
  const options = parseOptions(argv);
  const plan = maintenancePlan(options);
  const output = options.format === "json" ? `${JSON.stringify(plan, null, 2)}\n` : formatMarkdown(plan);
  process.stdout.write(output);
}

function parseOptions(argv) {
  const options = {
    action: "update",
    dryRun: false,
    format: "markdown",
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
      case "--update":
        options.action = "update";
        break;
      case "--uninstall":
        options.action = "uninstall";
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--format":
        options.format = takeValue();
        if (!["markdown", "json"].includes(options.format)) throw new Error("--format must be markdown or json");
        break;
      case "--help":
      case "-h":
        printUsage();
        process.exit(0);
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (!options.dryRun) {
    throw new Error("maintenance actions are dry-run only; pass --dry-run");
  }
  return options;
}

function maintenancePlan(options) {
  return {
    action: options.action,
    dryRun: true,
    repoRoot: ".",
    detected: {
      localConfig: existsSync(join(repoRoot, ".talking-pets.local.env")),
      nodeModules: existsSync(join(repoRoot, "node_modules")),
    },
    warning: "No files are changed or deleted by this command.",
    sections: sections.map(section => ({
      title: section.title,
      items: section.rows.map(([item, path, note]) => ({ item, path, note })),
    })),
  };
}

function formatMarkdown(plan) {
  const lines = [
    `# Talking Pets maintenance ${plan.action} dry-run`,
    "",
    plan.warning,
    "",
    `Detected local config: ${plan.detected.localConfig ? "yes" : "no"}`,
    `Detected node_modules: ${plan.detected.nodeModules ? "yes" : "no"}`,
  ];
  for (const section of plan.sections) {
    lines.push("", `## ${section.title}`, "", "| Item | Path | Note |", "| --- | --- | --- |");
    for (const item of section.items) {
      lines.push(`| ${cell(item.item)} | ${cell(item.path)} | ${cell(item.note)} |`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function cell(value) {
  return String(value).replaceAll("|", "\\|");
}

function printUsage() {
  console.log(`Usage:
  node scripts/talking-pets-maintenance.mjs --update --dry-run [--format markdown|json]
  node scripts/talking-pets-maintenance.mjs --uninstall --dry-run [--format markdown|json]

This command only prints a plan. It never deletes files, downloads runtimes, or edits config.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export {
  formatMarkdown,
  maintenancePlan,
  parseOptions,
};
