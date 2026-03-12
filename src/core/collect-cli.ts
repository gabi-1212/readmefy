import path from "node:path";
import type { CLIInfo, PackageManifest } from "../types/index.js";

export function collectCLI(
  cwd: string,
  packageManifest: PackageManifest | null
): CLIInfo {
  const binField = packageManifest?.bin;

  if (typeof binField === "string" && packageManifest?.name) {
    const binName =
      packageManifest.name.split("/").at(-1) ?? packageManifest.name;

    return {
      binName,
      commandPath: normalizeCommandPath(cwd, binField),
      commands: [binName],
      usageExamples: [`npx ${binName} --help`, `${binName} --help`]
    };
  }

  if (
    binField !== null &&
    typeof binField === "object" &&
    Object.keys(binField).length > 0
  ) {
    const firstEntry = Object.entries(binField).sort(([left], [right]) =>
      left.localeCompare(right)
    )[0];

    if (!firstEntry) {
      return {
        binName: null,
        commandPath: null,
        commands: [],
        usageExamples: []
      };
    }

    const [binName, commandPath] = firstEntry;

    return {
      binName,
      commandPath: normalizeCommandPath(cwd, commandPath),
      commands: Object.keys(binField).sort((left, right) =>
        left.localeCompare(right)
      ),
      usageExamples: [`npx ${binName} --help`, `${binName} --help`]
    };
  }

  return {
    binName: null,
    commandPath: null,
    commands: [],
    usageExamples: []
  };
}

function normalizeCommandPath(cwd: string, commandPath: string): string {
  return path
    .relative(cwd, path.join(cwd, commandPath))
    .split(path.sep)
    .join("/");
}
