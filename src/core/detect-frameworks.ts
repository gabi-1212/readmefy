import type { PackageManifest } from "../types/index.js";
import { uniqueSorted } from "../utils/strings.js";

export interface DetectFrameworksInput {
  packageManifest: PackageManifest | null;
  detectedFiles: string[];
}

export function detectFrameworks(input: DetectFrameworksInput): string[] {
  const dependencies = {
    ...(input.packageManifest?.dependencies ?? {}),
    ...(input.packageManifest?.devDependencies ?? {}),
    ...(input.packageManifest?.peerDependencies ?? {})
  };

  const frameworks: string[] = [];

  if (input.detectedFiles.includes("package.json")) {
    frameworks.push("Node.js");
  }

  if (
    input.detectedFiles.includes("tsconfig.json") ||
    "typescript" in dependencies
  ) {
    frameworks.push("TypeScript");
  }

  if ("react" in dependencies) {
    frameworks.push("React");
  }

  if (
    input.detectedFiles.some((file) => file.startsWith("next.config.")) ||
    "next" in dependencies
  ) {
    frameworks.push("Next.js");
  }

  if (
    input.detectedFiles.some((file) => file.startsWith("vite.config.")) ||
    "vite" in dependencies
  ) {
    frameworks.push("Vite");
  }

  if (
    input.detectedFiles.some((file) => file.startsWith("astro.config.")) ||
    "astro" in dependencies
  ) {
    frameworks.push("Astro");
  }

  if (
    input.detectedFiles.some((file) => file.startsWith("nuxt.config.")) ||
    "nuxt" in dependencies
  ) {
    frameworks.push("Nuxt");
  }

  if (input.detectedFiles.includes("turbo.json")) {
    frameworks.push("Turborepo");
  }

  if (input.detectedFiles.includes("nx.json")) {
    frameworks.push("Nx");
  }

  if (
    input.detectedFiles.includes("Dockerfile") ||
    input.detectedFiles.includes("docker-compose.yml")
  ) {
    frameworks.push("Docker");
  }

  if (
    input.detectedFiles.includes("pyproject.toml") ||
    input.detectedFiles.includes("requirements.txt")
  ) {
    frameworks.push("Python");
  }

  if (input.detectedFiles.includes("Cargo.toml")) {
    frameworks.push("Rust");
  }

  if (input.detectedFiles.includes("go.mod")) {
    frameworks.push("Go");
  }

  if (
    input.detectedFiles.some((file) => file.startsWith(".github/workflows/"))
  ) {
    frameworks.push("GitHub Actions");
  }

  const order = [
    "TypeScript",
    "Node.js",
    "React",
    "Next.js",
    "Vite",
    "Astro",
    "Nuxt",
    "Turborepo",
    "Nx",
    "Docker",
    "Python",
    "Rust",
    "Go",
    "GitHub Actions"
  ];

  return order.filter((framework) =>
    uniqueSorted(frameworks).includes(framework)
  );
}
