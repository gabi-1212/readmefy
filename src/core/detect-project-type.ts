import type {
  DetectedProject,
  PackageManifest,
  ProjectType
} from "../types/index.js";

export interface DetectProjectTypeInput {
  packageManifest: PackageManifest | null;
  detectedFiles: string[];
  workspacePackageCount: number;
  hasCli: boolean;
}

export function detectProjectType(
  input: DetectProjectTypeInput
): DetectedProject {
  const all = new Set<ProjectType>();
  const hasNext =
    input.detectedFiles.some((file) => file.startsWith("next.config.")) ||
    hasDependency(input.packageManifest, "next");
  const hasVite =
    input.detectedFiles.some((file) => file.startsWith("vite.config.")) ||
    hasDependency(input.packageManifest, "vite");
  const hasPython =
    input.detectedFiles.includes("pyproject.toml") ||
    input.detectedFiles.includes("requirements.txt");
  const hasRust = input.detectedFiles.includes("Cargo.toml");
  const hasGo = input.detectedFiles.includes("go.mod");
  const hasDocker =
    input.detectedFiles.includes("Dockerfile") ||
    input.detectedFiles.includes("docker-compose.yml");
  const hasMonorepoSignals =
    input.detectedFiles.includes("pnpm-workspace.yaml") ||
    input.detectedFiles.includes("turbo.json") ||
    input.detectedFiles.includes("nx.json") ||
    workspaceLooksLikeMonorepo(
      input.packageManifest,
      input.workspacePackageCount
    );

  if (hasMonorepoSignals) {
    all.add("monorepo");
  }

  if (hasNext) {
    all.add("next-app");
  }

  if (hasVite) {
    all.add("vite-app");
  }

  if (input.hasCli) {
    all.add("cli-tool");
  }

  if (hasPython) {
    all.add("python-package");
  }

  if (hasRust) {
    all.add("rust-crate");
  }

  if (hasGo) {
    all.add("go-module");
  }

  if (hasDocker) {
    all.add("dockerized-service");
  }

  if (input.packageManifest !== null && !hasNext && !hasVite && !input.hasCli) {
    if (looksLikeLibrary(input.packageManifest)) {
      all.add("node-library");
    } else {
      all.add("node-app");
    }
  }

  if (all.size === 0) {
    all.add("node-app");
  }

  const ordered = [...all].sort(projectPriority);
  const primary = ordered[0] ?? "node-app";

  return {
    primary,
    all: ordered,
    template:
      primary === "monorepo"
        ? "monorepo"
        : primary === "cli-tool"
          ? "cli"
          : primary === "node-library" ||
              primary === "python-package" ||
              primary === "rust-crate" ||
              primary === "go-module"
            ? "library"
            : "app"
  };
}

function projectPriority(left: ProjectType, right: ProjectType): number {
  const order: ProjectType[] = [
    "monorepo",
    "next-app",
    "vite-app",
    "cli-tool",
    "python-package",
    "rust-crate",
    "go-module",
    "dockerized-service",
    "node-library",
    "node-app"
  ];

  return order.indexOf(left) - order.indexOf(right);
}

function hasDependency(
  packageManifest: PackageManifest | null,
  dependency: string
): boolean {
  return (
    dependency in (packageManifest?.dependencies ?? {}) ||
    dependency in (packageManifest?.devDependencies ?? {}) ||
    dependency in (packageManifest?.peerDependencies ?? {})
  );
}

function looksLikeLibrary(packageManifest: PackageManifest): boolean {
  if (packageManifest.private === true) {
    return false;
  }

  return Boolean(
    packageManifest.exports ||
    packageManifest.main ||
    packageManifest.module ||
    packageManifest.types
  );
}

function workspaceLooksLikeMonorepo(
  packageManifest: PackageManifest | null,
  workspacePackageCount: number
): boolean {
  if (workspacePackageCount > 1) {
    return true;
  }

  const workspaces = packageManifest?.workspaces;
  return (
    Array.isArray(workspaces) ||
    (workspaces !== null && typeof workspaces === "object")
  );
}
