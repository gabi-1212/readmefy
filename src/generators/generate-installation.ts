import type { RepoAnalysis } from "../types/index.js";
import { codeFence } from "../utils/markdown.js";
import {
  dependencyInstallCommand,
  globalInstallCommand,
  projectInstallCommand
} from "../utils/commands.js";

export function generateInstallation(analysis: RepoAnalysis): string {
  const packageName = analysis.packageManifest?.name;
  const sections: string[] = [];

  if (
    analysis.project.primary === "cli-tool" &&
    packageName &&
    analysis.packageManifest?.private !== true
  ) {
    sections.push(
      "Install the CLI globally:",
      "",
      codeFence(
        "bash",
        globalInstallCommand(analysis.packageManager, packageName)
      )
    );
  } else if (
    analysis.project.primary === "node-library" &&
    packageName &&
    analysis.packageManifest?.private !== true
  ) {
    sections.push(
      "Install the package as a dependency:",
      "",
      codeFence(
        "bash",
        dependencyInstallCommand(analysis.packageManager, packageName)
      )
    );
  } else if (analysis.project.primary === "python-package") {
    sections.push(
      codeFence(
        "bash",
        [
          "python -m venv .venv",
          "source .venv/bin/activate",
          "pip install -e ."
        ].join("\n")
      )
    );
  } else if (analysis.project.primary === "rust-crate") {
    sections.push(codeFence("bash", "cargo build"));
  } else if (analysis.project.primary === "go-module") {
    sections.push(codeFence("bash", "go build ./..."));
  }

  if (
    analysis.project.primary === "dockerized-service" ||
    analysis.flags.hasCompose
  ) {
    sections.push(
      "Run the service with Docker Compose:",
      "",
      codeFence("bash", "docker compose up --build")
    );
  }

  sections.push(
    "Install from the repository root:",
    "",
    codeFence("bash", projectInstallCommand(analysis.packageManager))
  );

  return sections.join("\n");
}
