import path from "node:path";
import { analyzeRepo } from "../core/analyze-repo.js";
import type { GenerateCommandOptions, ReadmefyConfig } from "../types/index.js";
import { pathExists, writeTextFile } from "../utils/file.js";

export interface InitCommandResult {
  created: boolean;
  outputPath: string;
  template: string;
}

export async function runInitCommand(
  options: GenerateCommandOptions
): Promise<InitCommandResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const outputPath = path.join(cwd, "readmefy.config.json");

  if ((await pathExists(outputPath)) && !options.force) {
    return {
      created: false,
      outputPath,
      template: "existing"
    };
  }

  const analysis = await analyzeRepo({
    cwd,
    configOverrides: buildConfigOverrides(options)
  });

  const config: ReadmefyConfig = {
    template: options.template ?? analysis.project.template,
    preserve: true,
    protectedSections: ["overview", "why"],
    sections: {
      "cli-usage": analysis.cli.binName !== null,
      environment: analysis.env.length > 0,
      "quick-start": analysis.project.primary !== "node-library"
    }
  };

  await writeTextFile(outputPath, JSON.stringify(config, null, 2));

  return {
    created: true,
    outputPath,
    template: config.template ?? analysis.project.template
  };
}

function buildConfigOverrides(
  options: GenerateCommandOptions
): Partial<ReadmefyConfig> & {
  badgesEnabled?: boolean;
} {
  return {
    ...(options.template === undefined ? {} : { template: options.template }),
    ...(options.badges === undefined ? {} : { badgesEnabled: options.badges })
  };
}
