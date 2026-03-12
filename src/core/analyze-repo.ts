import path from "node:path";
import fg from "fast-glob";
import { parse as parseToml } from "smol-toml";
import { templateDefinitions } from "../config/defaults.js";
import type {
  ReadmefyConfig,
  RepoAnalysis,
  RepositoryCoordinates
} from "../types/index.js";
import { loadConfig } from "../config/load-config.js";
import { collectCI } from "./collect-ci.js";
import { collectCLI } from "./collect-cli.js";
import { collectEnv } from "./collect-env.js";
import { collectLicense } from "./collect-license.js";
import { collectPublicApi } from "./collect-public-api.js";
import { collectScripts } from "./collect-scripts.js";
import { collectStructure } from "./collect-structure.js";
import { detectFrameworks } from "./detect-frameworks.js";
import { detectPackageManager } from "./detect-package-manager.js";
import { detectProjectType } from "./detect-project-type.js";
import { readJsonFile, readTextIfExists } from "../utils/file.js";
import { humanizePackageName } from "../utils/strings.js";

const ANALYSIS_PATTERNS = [
  "package.json",
  "tsconfig.json",
  "jsconfig.json",
  "next.config.*",
  "vite.config.*",
  "astro.config.*",
  "nuxt.config.*",
  "Dockerfile",
  "docker-compose.yml",
  ".env.example",
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lock",
  "bun.lockb",
  "pnpm-workspace.yaml",
  "turbo.json",
  "nx.json",
  "pyproject.toml",
  "requirements.txt",
  "Cargo.toml",
  "go.mod",
  "Makefile",
  ".github/workflows/*.{yml,yaml}",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "LICENSE*"
] as const;

const IGNORES = [
  "**/node_modules/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.next/**",
  "**/.turbo/**",
  "**/.git/**"
];

export interface AnalyzeRepoOptions {
  cwd: string;
  configOverrides?: Partial<ReadmefyConfig> & {
    badgesEnabled?: boolean;
  };
}

export async function analyzeRepo(
  options: AnalyzeRepoOptions
): Promise<RepoAnalysis> {
  const cwd = path.resolve(options.cwd);
  const { config, configPath } = await loadConfig(
    options.configOverrides
      ? {
          cwd,
          overrides: options.configOverrides
        }
      : { cwd }
  );
  const detectedFiles: string[] = await fg([...ANALYSIS_PATTERNS], {
    cwd,
    dot: true,
    onlyFiles: true,
    unique: true,
    ignore: IGNORES
  });
  detectedFiles.sort((left, right) => left.localeCompare(right));
  const workflowFiles = detectedFiles.filter((file) =>
    file.startsWith(".github/workflows/")
  );
  const workspacePackageCount = await countWorkspacePackages(cwd);
  const packageManifest = await readJsonFile<
    Record<string, unknown> & { workspaces?: unknown }
  >(path.join(cwd, "package.json"));
  const normalizedPackageManifest = (packageManifest ??
    null) as RepoAnalysis["packageManifest"];
  const packageManager = detectPackageManager({
    packageManifest: normalizedPackageManifest,
    detectedFiles
  });
  const frameworks = detectFrameworks({
    packageManifest: normalizedPackageManifest,
    detectedFiles
  });
  const cli = collectCLI(cwd, normalizedPackageManifest);
  const project = detectProjectType({
    packageManifest: normalizedPackageManifest,
    detectedFiles,
    workspacePackageCount,
    hasCli: cli.binName !== null
  });

  if (configPath === null && options.configOverrides?.template === undefined) {
    config.template = project.template;
    config.sectionOrder = templateDefinitions[project.template].sectionOrder;
  }

  const [scripts, env, structure, ci, license, publicApi] = await Promise.all([
    collectScripts(cwd, normalizedPackageManifest),
    collectEnv(cwd),
    collectStructure(cwd, config),
    collectCI(cwd, workflowFiles),
    collectLicense(cwd, normalizedPackageManifest),
    collectPublicApi(cwd, normalizedPackageManifest)
  ]);

  const metadata = await collectMetadata(
    cwd,
    normalizedPackageManifest,
    detectedFiles
  );
  const repository = parseRepositoryCoordinates(metadata.repositoryUrl);
  const warnings = collectWarnings({
    metadata,
    detectedFiles,
    envCount: env.length,
    license: license.spdx,
    workflows: ci.workflows.length
  });

  return {
    cwd,
    detectedFiles,
    metadata,
    packageManifest: normalizedPackageManifest,
    repository,
    project,
    frameworks,
    packageManager,
    scripts,
    env,
    structure,
    ci,
    license,
    cli,
    publicApi,
    warnings,
    flags: {
      hasDocker: detectedFiles.includes("Dockerfile"),
      hasCompose: detectedFiles.includes("docker-compose.yml"),
      hasEnvExample: detectedFiles.includes(".env.example"),
      hasMakefile: detectedFiles.includes("Makefile")
    },
    config
  };
}

async function countWorkspacePackages(cwd: string): Promise<number> {
  const packages = await fg(["**/package.json"], {
    cwd,
    onlyFiles: true,
    ignore: IGNORES,
    deep: 4
  });
  return packages.length;
}

async function collectMetadata(
  cwd: string,
  packageManifest: RepoAnalysis["packageManifest"],
  detectedFiles: string[]
): Promise<RepoAnalysis["metadata"]> {
  const fromPackageJson = {
    title: packageManifest?.name
      ? humanizePackageName(packageManifest.name)
      : "",
    description: packageManifest?.description ?? "",
    version: packageManifest?.version ?? "",
    private: packageManifest?.private ?? false,
    homepage: packageManifest?.homepage ?? "",
    repositoryUrl: extractRepositoryUrl(packageManifest?.repository),
    bugsUrl: extractBugsUrl(packageManifest?.bugs)
  };

  if (packageManifest !== null) {
    return normalizeMetadata(fromPackageJson);
  }

  if (detectedFiles.includes("pyproject.toml")) {
    const content = await readTextIfExists(path.join(cwd, "pyproject.toml"));
    const parsed = content
      ? (parseToml(content) as Record<string, unknown>)
      : {};
    const projectTable =
      (parsed.project as Record<string, unknown> | undefined) ?? {};
    const poetryTable =
      ((parsed.tool as Record<string, unknown> | undefined)?.poetry as
        | Record<string, unknown>
        | undefined) ?? {};

    return normalizeMetadata({
      title:
        stringValue(projectTable.name) ??
        stringValue(poetryTable.name) ??
        "Python Package",
      description:
        stringValue(projectTable.description) ??
        stringValue(poetryTable.description) ??
        "",
      version:
        stringValue(projectTable.version) ??
        stringValue(poetryTable.version) ??
        "",
      private: false,
      homepage: "",
      repositoryUrl: "",
      bugsUrl: ""
    });
  }

  if (detectedFiles.includes("Cargo.toml")) {
    const content = await readTextIfExists(path.join(cwd, "Cargo.toml"));
    const parsed = content
      ? (parseToml(content) as Record<string, unknown>)
      : {};
    const packageTable =
      (parsed.package as Record<string, unknown> | undefined) ?? {};

    return normalizeMetadata({
      title: stringValue(packageTable.name) ?? "Rust Crate",
      description: stringValue(packageTable.description) ?? "",
      version: stringValue(packageTable.version) ?? "",
      private: false,
      homepage: stringValue(packageTable.homepage) ?? "",
      repositoryUrl: stringValue(packageTable.repository) ?? "",
      bugsUrl: ""
    });
  }

  if (detectedFiles.includes("go.mod")) {
    const content = await readTextIfExists(path.join(cwd, "go.mod"));
    const moduleLine =
      content?.split("\n").find((line) => line.startsWith("module ")) ?? "";
    const moduleName = moduleLine.replace(/^module\s+/, "").trim();

    return normalizeMetadata({
      title:
        moduleName.length > 0 ? humanizePackageName(moduleName) : "Go Module",
      description: "",
      version: "",
      private: false,
      homepage: "",
      repositoryUrl: "",
      bugsUrl: ""
    });
  }

  return normalizeMetadata({
    title: humanizePackageName(path.basename(cwd)),
    description: "",
    version: "",
    private: false,
    homepage: "",
    repositoryUrl: "",
    bugsUrl: ""
  });
}

function normalizeMetadata(
  metadata: RepoAnalysis["metadata"]
): RepoAnalysis["metadata"] {
  return {
    title: metadata.title.length > 0 ? metadata.title : "Project",
    description: metadata.description,
    version: metadata.version,
    private: metadata.private,
    homepage: metadata.homepage,
    repositoryUrl: metadata.repositoryUrl,
    bugsUrl: metadata.bugsUrl
  };
}

function extractRepositoryUrl(repository: unknown): string {
  if (typeof repository === "string") {
    return repository;
  }

  if (repository && typeof repository === "object") {
    const value = (repository as { url?: unknown }).url;
    if (typeof value === "string") {
      return value;
    }
  }

  return "";
}

function extractBugsUrl(bugs: unknown): string {
  if (typeof bugs === "string") {
    return bugs;
  }

  if (bugs && typeof bugs === "object") {
    const value = (bugs as { url?: unknown }).url;
    if (typeof value === "string") {
      return value;
    }
  }

  return "";
}

function parseRepositoryCoordinates(
  repositoryUrl: string
): RepositoryCoordinates | null {
  if (!repositoryUrl.includes("github.com")) {
    return null;
  }

  const sanitized = repositoryUrl
    .replace(/^git\+/, "")
    .replace(/^git@github.com:/, "https://github.com/")
    .replace(/\.git$/, "");
  const match = /github\.com\/([^/]+)\/([^/#]+)/.exec(sanitized);

  if (!match) {
    return null;
  }

  const owner = match[1];
  const repo = match[2];

  if (!owner || !repo) {
    return null;
  }

  return {
    owner,
    repo,
    url: `https://github.com/${owner}/${repo}`
  };
}

function collectWarnings(input: {
  metadata: RepoAnalysis["metadata"];
  detectedFiles: string[];
  envCount: number;
  license: string;
  workflows: number;
}): string[] {
  const warnings: string[] = [];

  if (input.metadata.description.length === 0) {
    warnings.push("No repository description was detected.");
  }

  if (input.license === "UNLICENSED") {
    warnings.push("No explicit license was detected.");
  }

  if (input.workflows === 0) {
    warnings.push("No GitHub Actions workflows were detected.");
  }

  if (input.detectedFiles.includes(".env.example") && input.envCount === 0) {
    warnings.push(
      ".env.example exists but no environment variables were parsed."
    );
  }

  if (!input.detectedFiles.includes("README.md")) {
    warnings.push("No README.md exists yet.");
  }

  return warnings;
}

function stringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}
