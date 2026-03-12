import type { PackageManager, PackageManifest } from "../types/index.js";

export interface DetectPackageManagerInput {
  packageManifest: PackageManifest | null;
  detectedFiles: string[];
}

export function detectPackageManager(
  input: DetectPackageManagerInput
): PackageManager {
  const packageManagerField =
    input.packageManifest?.packageManager?.split("@")[0];

  if (
    packageManagerField === "npm" ||
    packageManagerField === "pnpm" ||
    packageManagerField === "yarn" ||
    packageManagerField === "bun"
  ) {
    return packageManagerField;
  }

  if (input.detectedFiles.includes("pnpm-lock.yaml")) {
    return "pnpm";
  }

  if (input.detectedFiles.includes("yarn.lock")) {
    return "yarn";
  }

  if (
    input.detectedFiles.includes("bun.lockb") ||
    input.detectedFiles.includes("bun.lock")
  ) {
    return "bun";
  }

  if (input.detectedFiles.includes("package-lock.json")) {
    return "npm";
  }

  return input.packageManifest === null ? "unknown" : "npm";
}
