import { spawnSync } from "node:child_process";

function commandExists(command) {
  const probe = process.platform === "win32"
    ? spawnSync("where.exe", [command], { stdio: "ignore" })
    : spawnSync("command", ["-v", command], { stdio: "ignore", shell: true });
  return probe.status === 0;
}

function windowsPowerShellCommand(exists = commandExists) {
  if (exists("powershell.exe")) return "powershell.exe";
  if (exists("pwsh.exe")) return "pwsh.exe";
  if (exists("pwsh")) return "pwsh";
  return null;
}

export { commandExists, windowsPowerShellCommand };
