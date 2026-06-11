#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const skillNames = ["classmap-maintain", "classmap-target"];

function readPackageJson() {
  const packageJsonPath = path.join(packageRoot, "package.json");
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

function printHelp() {
  const pkg = readPackageJson();
  console.log(`${pkg.name} ${pkg.version}

Usage:
  classmap-skill install [--target <dir>]
  classmap-skill --help
  classmap-skill --version

Commands:
  install           Install classmap-maintain and classmap-target skills.

Options:
  --target <dir>    Skills root directory. Defaults to ~/.agents/skills.
  -h, --help        Show this help message.
  -v, --version     Show package version.

Examples:
  npx @qingyuwanan/classmap-skill install
  npx @qingyuwanan/classmap-skill install --target ~/.codex/skills`);
}

function expandHome(inputPath) {
  if (inputPath === "~") {
    return os.homedir();
  }

  if (inputPath.startsWith(`~${path.sep}`) || inputPath.startsWith("~/")) {
    return path.join(os.homedir(), inputPath.slice(2));
  }

  return inputPath;
}

function parseInstallArgs(args) {
  let target = path.join(os.homedir(), ".agents", "skills");

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--target") {
      const value = args[index + 1];
      if (!value || value.startsWith("-")) {
        throw new Error("Missing value for --target.");
      }
      target = value;
      index += 1;
      continue;
    }

    if (arg.startsWith("--target=")) {
      target = arg.slice("--target=".length);
      if (!target) {
        throw new Error("Missing value for --target.");
      }
      continue;
    }

    throw new Error(`Unknown install option: ${arg}`);
  }

  return path.resolve(expandHome(target));
}

function assertSourcesExist() {
  for (const skillName of skillNames) {
    const sourceDir = path.join(packageRoot, skillName);
    const stat = fs.existsSync(sourceDir) ? fs.statSync(sourceDir) : null;
    if (!stat?.isDirectory()) {
      throw new Error(`Missing bundled skill directory: ${skillName}`);
    }
  }
}

function installSkills(args) {
  const targetRoot = parseInstallArgs(args);

  assertSourcesExist();
  fs.mkdirSync(targetRoot, { recursive: true });

  for (const skillName of skillNames) {
    const sourceDir = path.join(packageRoot, skillName);
    const targetDir = path.join(targetRoot, skillName);

    fs.rmSync(targetDir, { recursive: true, force: true });
    fs.cpSync(sourceDir, targetDir, { recursive: true });
  }

  console.log("Installed Classmap skills:");
  for (const skillName of skillNames) {
    console.log(`- ${path.join(targetRoot, skillName)}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "--version" || command === "-v") {
    console.log(readPackageJson().version);
    return;
  }

  if (command === "install") {
    installSkills(args.slice(1));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  console.error(`classmap-skill: ${error.message}`);
  process.exitCode = 1;
}
