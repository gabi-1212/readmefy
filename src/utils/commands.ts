import type { PackageManager } from "../types/index.js";

export function projectInstallCommand(packageManager: PackageManager): string {
  switch (packageManager) {
    case "pnpm":
      return "pnpm install";
    case "yarn":
      return "yarn install";
    case "bun":
      return "bun install";
    case "npm":
    case "unknown":
    default:
      return "npm install";
  }
}

export function dependencyInstallCommand(
  packageManager: PackageManager,
  packageName: string
): string {
  switch (packageManager) {
    case "pnpm":
      return `pnpm add ${packageName}`;
    case "yarn":
      return `yarn add ${packageName}`;
    case "bun":
      return `bun add ${packageName}`;
    case "npm":
    case "unknown":
    default:
      return `npm install ${packageName}`;
  }
}

export function globalInstallCommand(
  packageManager: PackageManager,
  packageName: string
): string {
  switch (packageManager) {
    case "pnpm":
      return `pnpm add -g ${packageName}`;
    case "yarn":
      return `yarn global add ${packageName}`;
    case "bun":
      return `bun add -g ${packageName}`;
    case "npm":
    case "unknown":
    default:
      return `npm install -g ${packageName}`;
  }
}

export function runScriptCommand(
  packageManager: PackageManager,
  scriptName: string
): string {
  switch (packageManager) {
    case "pnpm":
      return `pnpm ${scriptName}`;
    case "yarn":
      return `yarn ${scriptName}`;
    case "bun":
      return `bun run ${scriptName}`;
    case "npm":
    case "unknown":
    default:
      return `npm run ${scriptName}`;
  }
}
