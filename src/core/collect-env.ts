import path from "node:path";
import type { EnvVariable } from "../types/index.js";
import { normalizePath } from "../utils/paths.js";
import { readTextIfExists } from "../utils/file.js";

export async function collectEnv(cwd: string): Promise<EnvVariable[]> {
  const envPath = path.join(cwd, ".env.example");
  const content = await readTextIfExists(envPath);

  if (content === null) {
    return [];
  }

  const variables: EnvVariable[] = [];
  let pendingDescription = "";

  for (const line of content.split("\n")) {
    if (line.trim().startsWith("#")) {
      pendingDescription = line.trim().replace(/^#\s?/, "");
      continue;
    }

    const match = /^([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line.trim());

    if (!match) {
      pendingDescription = "";
      continue;
    }

    const name = match[1] ?? "";
    const sample = match[2] ?? "";
    variables.push({
      name,
      sample,
      required: sample.length === 0,
      description: pendingDescription,
      source: normalizePath(path.relative(cwd, envPath))
    });
    pendingDescription = "";
  }

  return variables;
}
