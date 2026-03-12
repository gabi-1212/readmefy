import type { RepoAnalysis } from "../types/index.js";
import { codeFence } from "../utils/markdown.js";
import { runScriptCommand } from "../utils/commands.js";

export function generateQuickStart(analysis: RepoAnalysis): string {
  if (analysis.project.primary === "node-library") {
    return "";
  }

  const commands: string[] = [];
  const preferredScript = findFirstScript(analysis, [
    "dev",
    "start",
    "preview"
  ]);

  if (preferredScript !== null) {
    commands.push(runScriptCommand(analysis.packageManager, preferredScript));
  } else if (
    analysis.project.primary === "dockerized-service" ||
    analysis.flags.hasCompose
  ) {
    commands.push("docker compose up --build");
  } else if (analysis.project.primary === "python-package") {
    commands.push(`python -m ${guessPythonModuleName(analysis)}`);
  } else if (analysis.project.primary === "rust-crate") {
    commands.push("cargo run");
  } else if (analysis.project.primary === "go-module") {
    commands.push("go run .");
  }

  if (commands.length === 0) {
    return "";
  }

  return codeFence("bash", commands.join("\n"));
}

export function generateUsage(analysis: RepoAnalysis): string {
  if (
    analysis.project.primary === "node-library" &&
    analysis.packageManifest?.name &&
    analysis.packageManifest.private !== true
  ) {
    const packageName = analysis.packageManifest.name;

    if (analysis.publicApi.namedExports.length > 0) {
      const imports = analysis.publicApi.namedExports.slice(0, 3).join(", ");
      return [
        "Import the public API from the package entrypoint:",
        "",
        codeFence("ts", `import { ${imports} } from "${packageName}";`)
      ].join("\n");
    }

    if (analysis.publicApi.hasDefaultExport) {
      const identifier =
        packageName
          .split("/")
          .at(-1)
          ?.replace(/[^A-Za-z0-9]/g, "") ?? "library";
      return [
        "Import the default export from the package entrypoint:",
        "",
        codeFence("ts", `import ${identifier} from "${packageName}";`)
      ].join("\n");
    }
  }

  if (
    analysis.project.primary === "cli-tool" &&
    analysis.cli.usageExamples.length > 0
  ) {
    return codeFence("bash", analysis.cli.usageExamples.join("\n"));
  }

  if (analysis.project.primary === "python-package") {
    return codeFence("bash", `python -m ${guessPythonModuleName(analysis)}`);
  }

  if (analysis.project.primary === "rust-crate") {
    return codeFence("bash", "cargo run");
  }

  if (analysis.project.primary === "go-module") {
    return codeFence("bash", "go run .");
  }

  if (
    analysis.project.primary === "dockerized-service" ||
    analysis.flags.hasCompose
  ) {
    return codeFence("bash", "docker compose up --build");
  }

  const scripts = ["dev", "build", "test", "lint", "start"].filter(
    (scriptName) =>
      analysis.scripts.some((script) => script.name === scriptName)
  );

  if (scripts.length > 0) {
    return codeFence(
      "bash",
      scripts
        .map((scriptName) =>
          runScriptCommand(analysis.packageManager, scriptName)
        )
        .join("\n")
    );
  }

  return "";
}

export function generateCliUsage(analysis: RepoAnalysis): string {
  if (analysis.cli.usageExamples.length === 0) {
    return "";
  }

  return [
    analysis.cli.commandPath
      ? `The CLI entrypoint is wired to \`${analysis.cli.commandPath}\`.`
      : "The repository exposes a CLI entrypoint.",
    "",
    codeFence("bash", analysis.cli.usageExamples.join("\n"))
  ].join("\n");
}

function findFirstScript(
  analysis: RepoAnalysis,
  scriptNames: string[]
): string | null {
  for (const scriptName of scriptNames) {
    if (analysis.scripts.some((script) => script.name === scriptName)) {
      return scriptName;
    }
  }

  return null;
}

function guessPythonModuleName(analysis: RepoAnalysis): string {
  return analysis.metadata.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}
