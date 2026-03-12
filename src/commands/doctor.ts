import path from "node:path";
import { analyzeRepo } from "../core/analyze-repo.js";
import type { GenerateCommandOptions, ReadmefyConfig } from "../types/index.js";

export interface DoctorResult {
  cwd: string;
  title: string;
  projectType: string;
  template: string;
  packageManager: string;
  frameworks: string[];
  warnings: string[];
  detectedFiles: string[];
}

export async function runDoctorCommand(
  options: GenerateCommandOptions
): Promise<DoctorResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const analysis = await analyzeRepo({
    cwd,
    configOverrides: buildConfigOverrides(options)
  });

  return {
    cwd,
    title: analysis.metadata.title,
    projectType: analysis.project.primary,
    template: analysis.project.template,
    packageManager: analysis.packageManager,
    frameworks: analysis.frameworks,
    warnings: analysis.warnings,
    detectedFiles: analysis.detectedFiles
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
