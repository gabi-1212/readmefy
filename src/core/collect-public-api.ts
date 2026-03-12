import path from "node:path";
import type { PackageManifest, PublicApiInfo } from "../types/index.js";
import { pathExists, readTextIfExists } from "../utils/file.js";
import { normalizePath } from "../utils/paths.js";

const ENTRY_CANDIDATES = [
  "src/index.ts",
  "src/index.tsx",
  "src/index.js",
  "src/index.mjs",
  "lib/index.ts",
  "lib/index.js",
  "index.ts",
  "index.js"
];

export async function collectPublicApi(
  cwd: string,
  packageManifest: PackageManifest | null
): Promise<PublicApiInfo> {
  const candidates = [
    normalizeEntry(packageManifest?.types),
    normalizeEntry(packageManifest?.module),
    normalizeEntry(packageManifest?.main),
    ...ENTRY_CANDIDATES
  ].filter((candidate): candidate is string => candidate !== null);

  const entryFile = await findFirstExisting(cwd, candidates);

  if (entryFile === null) {
    return {
      entryFile: null,
      namedExports: [],
      hasDefaultExport: false
    };
  }

  const content = (await readTextIfExists(path.join(cwd, entryFile))) ?? "";
  const namedExports = extractNamedExports(content);

  return {
    entryFile,
    namedExports,
    hasDefaultExport: /\bexport\s+default\b/.test(content)
  };
}

function normalizeEntry(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  if (value.endsWith(".d.ts")) {
    return null;
  }

  return value;
}

async function findFirstExisting(
  cwd: string,
  candidates: string[]
): Promise<string | null> {
  for (const candidate of candidates) {
    const normalized = normalizePath(candidate);
    if (await pathExists(path.join(cwd, normalized))) {
      return normalized;
    }
  }

  return null;
}

function extractNamedExports(content: string): string[] {
  const names = new Set<string>();

  for (const match of content.matchAll(
    /\bexport\s+(?:async\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_]+)/g
  )) {
    const name = match[1];
    if (name) {
      names.add(name);
    }
  }

  for (const match of content.matchAll(/\bexport\s*{\s*([^}]+)\s*}/g)) {
    const block = match[1];

    if (!block) {
      continue;
    }

    for (const part of block.split(",")) {
      const [name = ""] = part.trim().split(/\s+as\s+/);
      if (name.length > 0) {
        names.add(name);
      }
    }
  }

  return [...names].sort((left, right) => left.localeCompare(right));
}
