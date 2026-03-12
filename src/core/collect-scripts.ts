import type { PackageManifest, ScriptEntry } from "../types/index.js";
import { readTextIfExists } from "../utils/file.js";

export async function collectScripts(
  cwd: string,
  packageManifest: PackageManifest | null
): Promise<ScriptEntry[]> {
  const scripts: ScriptEntry[] = [];

  for (const [name, command] of Object.entries(
    packageManifest?.scripts ?? {}
  ).sort(([left], [right]) => left.localeCompare(right))) {
    scripts.push({
      name,
      command,
      source: "package.json"
    });
  }

  const makefile = await readTextIfExists(`${cwd}/Makefile`);

  if (makefile !== null) {
    for (const line of makefile.split("\n")) {
      const match = /^(?!\.PHONY)([A-Za-z0-9_.-]+):(?:\s|$)/.exec(line);

      if (!match) {
        continue;
      }

      const name = match[1] ?? "";

      if (!scripts.some((script) => script.name === name)) {
        scripts.push({
          name,
          command: `make ${name}`,
          source: "Makefile"
        });
      }
    }
  }

  return scripts;
}
