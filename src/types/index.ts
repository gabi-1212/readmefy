export const SECTION_IDS = [
  "badges",
  "overview",
  "why",
  "features",
  "tech-stack",
  "installation",
  "quick-start",
  "usage",
  "cli-usage",
  "scripts",
  "environment",
  "structure",
  "development",
  "ci-cd",
  "contributing",
  "security",
  "license"
] as const;

export const TEMPLATE_NAMES = ["library", "app", "cli", "monorepo"] as const;

export const PROJECT_TYPES = [
  "node-library",
  "node-app",
  "next-app",
  "vite-app",
  "cli-tool",
  "monorepo",
  "python-package",
  "rust-crate",
  "go-module",
  "dockerized-service"
] as const;

export const PACKAGE_MANAGERS = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
  "unknown"
] as const;

export type SectionId = (typeof SECTION_IDS)[number];
export type TemplateName = (typeof TEMPLATE_NAMES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export interface PackageManifest {
  name?: string;
  description?: string;
  version?: string;
  private?: boolean;
  packageManager?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  repository?:
    | string
    | {
        type?: string;
        url?: string;
        directory?: string;
      };
  bugs?:
    | string
    | {
        url?: string;
      };
  homepage?: string;
  license?: string;
  bin?: string | Record<string, string>;
  engines?: Record<string, string>;
  main?: string;
  module?: string;
  types?: string;
  exports?: unknown;
  workspaces?: unknown;
}

export interface RepositoryCoordinates {
  owner: string;
  repo: string;
  url: string;
}

export interface RepoMetadata {
  title: string;
  description: string;
  version: string;
  private: boolean;
  homepage: string;
  repositoryUrl: string;
  bugsUrl: string;
}

export interface ScriptEntry {
  name: string;
  command: string;
  source: "package.json" | "Makefile";
}

export interface EnvVariable {
  name: string;
  sample: string;
  required: boolean;
  description: string;
  source: string;
}

export interface StructureNode {
  name: string;
  path: string;
  type: "directory" | "file";
  children: StructureNode[];
}

export interface WorkflowInfo {
  name: string;
  file: string;
  events: string[];
}

export interface CIInfo {
  provider: "github-actions";
  workflows: WorkflowInfo[];
}

export interface LicenseInfo {
  spdx: string;
  source: "package.json" | "license-file" | "unknown";
  file?: string;
}

export interface CLIInfo {
  binName: string | null;
  commandPath: string | null;
  commands: string[];
  usageExamples: string[];
}

export interface PublicApiInfo {
  entryFile: string | null;
  namedExports: string[];
  hasDefaultExport: boolean;
}

export interface DetectedProject {
  primary: ProjectType;
  all: ProjectType[];
  template: TemplateName;
}

export interface AnalysisFlags {
  hasDocker: boolean;
  hasCompose: boolean;
  hasEnvExample: boolean;
  hasMakefile: boolean;
}

export interface BadgeConfig {
  enabled: boolean;
  npm: boolean;
  license: boolean;
  ci: boolean;
}

export interface StructureConfig {
  maxDepth: number;
  maxEntriesPerDirectory: number;
  include: string[];
  exclude: string[];
}

export interface ReadmefyConfig {
  title?: string;
  customIntro?: string;
  why?: string;
  features?: string[];
  template?: TemplateName;
  output?: string;
  preserve?: boolean;
  sectionOrder?: SectionId[];
  protectedSections?: SectionId[];
  sections?: Partial<Record<SectionId, boolean>>;
  badgeConfiguration?: Partial<BadgeConfig>;
  structure?: Partial<StructureConfig>;
}

export interface ResolvedConfig {
  title?: string;
  customIntro?: string;
  why?: string;
  features: string[];
  template: TemplateName;
  output: string;
  preserve: boolean;
  sectionOrder: SectionId[];
  protectedSections: SectionId[];
  sections: Record<SectionId, boolean>;
  badgeConfiguration: BadgeConfig;
  structure: StructureConfig;
}

export interface RepoAnalysis {
  cwd: string;
  detectedFiles: string[];
  metadata: RepoMetadata;
  packageManifest: PackageManifest | null;
  repository: RepositoryCoordinates | null;
  project: DetectedProject;
  frameworks: string[];
  packageManager: PackageManager;
  scripts: ScriptEntry[];
  env: EnvVariable[];
  structure: StructureNode[];
  ci: CIInfo;
  license: LicenseInfo;
  cli: CLIInfo;
  publicApi: PublicApiInfo;
  warnings: string[];
  flags: AnalysisFlags;
  config: ResolvedConfig;
}

export interface GenerateReadmeResult {
  content: string;
  sections: SectionId[];
  template: TemplateName;
}

export interface DiffSummary {
  firstDifferenceLine: number;
  message: string;
  expectedSnippet: string[];
  actualSnippet: string[];
}

export interface GenerateCommandOptions {
  cwd?: string;
  output?: string;
  force?: boolean;
  check?: boolean;
  json?: boolean;
  template?: TemplateName;
  badges?: boolean;
  preserve?: boolean;
  debug?: boolean;
}

export interface CommandResult {
  changed: boolean;
  outputPath: string;
  content: string;
  warnings: string[];
  projectType: ProjectType;
  template: TemplateName;
  diff?: DiffSummary;
}
