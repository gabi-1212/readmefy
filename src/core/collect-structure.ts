import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ResolvedConfig, StructureNode } from "../types/index.js";
import { normalizePath } from "../utils/paths.js";

const IMPORTANT_FILES = new Set([
  "package.json",
  "tsconfig.json",
  "jsconfig.json",
  "next.config.js",
  "next.config.mjs",
  "next.config.ts",
  "vite.config.js",
  "vite.config.ts",
  "astro.config.mjs",
  "nuxt.config.ts",
  "pnpm-workspace.yaml",
  "turbo.json",
  "nx.json",
  "Dockerfile",
  "docker-compose.yml",
  "pyproject.toml",
  "Cargo.toml",
  "go.mod",
  "Makefile"
]);

export async function collectStructure(
  cwd: string,
  config: ResolvedConfig
): Promise<StructureNode[]> {
  const roots = await readdir(cwd, { withFileTypes: true });
  const includedRoots = roots
    .filter((entry) => {
      if (config.structure.exclude.includes(entry.name)) {
        return false;
      }

      if (entry.isDirectory()) {
        return config.structure.include.includes(entry.name);
      }

      return IMPORTANT_FILES.has(entry.name);
    })
    .sort((left, right) => left.name.localeCompare(right.name));

  const nodes: StructureNode[] = [];

  for (const entry of includedRoots) {
    const entryPath = path.join(cwd, entry.name);

    if (entry.isDirectory()) {
      nodes.push(
        await readDirectory(entryPath, normalizePath(entry.name), 1, config)
      );
    } else {
      nodes.push({
        name: entry.name,
        path: normalizePath(entry.name),
        type: "file",
        children: []
      });
    }
  }

  return nodes;
}

async function readDirectory(
  absolutePath: string,
  relativePath: string,
  depth: number,
  config: ResolvedConfig
): Promise<StructureNode> {
  const entries = await readdir(absolutePath, { withFileTypes: true });
  const filtered = entries
    .filter((entry) => !config.structure.exclude.includes(entry.name))
    .sort((left, right) => {
      if (left.isDirectory() && !right.isDirectory()) {
        return -1;
      }

      if (!left.isDirectory() && right.isDirectory()) {
        return 1;
      }

      return left.name.localeCompare(right.name);
    })
    .slice(0, config.structure.maxEntriesPerDirectory);

  const children: StructureNode[] = [];

  for (const entry of filtered) {
    const nextAbsolute = path.join(absolutePath, entry.name);
    const nextRelative = normalizePath(path.join(relativePath, entry.name));

    if (entry.isDirectory()) {
      if (depth >= config.structure.maxDepth) {
        children.push({
          name: entry.name,
          path: nextRelative,
          type: "directory",
          children: []
        });
        continue;
      }

      children.push(
        await readDirectory(nextAbsolute, nextRelative, depth + 1, config)
      );
      continue;
    }

    if (entry.name.endsWith(".map")) {
      continue;
    }

    children.push({
      name: entry.name,
      path: nextRelative,
      type: "file",
      children: []
    });
  }

  return {
    name: path.basename(relativePath),
    path: relativePath,
    type: "directory",
    children
  };
}
