import path from "node:path";
import type {
  CommandResult,
  GenerateCommandOptions,
  ReadmefyConfig
} from "../types/index.js";
import { analyzeRepo } from "../core/analyze-repo.js";
import { generateReadme } from "../generators/generate-readme.js";
import { mergeReadme } from "../generators/merge-readme.js";
import { createDiffSummary } from "../utils/diff.js";
import { pathExists, readTextIfExists, writeTextFile } from "../utils/file.js";
import { resolveOutputPath } from "../utils/paths.js";

export async function runGenerateCommand(
  options: GenerateCommandOptions
): Promise<CommandResult> {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const configOverrides = buildConfigOverrides(options);
  const analysis = await analyzeRepo({
    cwd,
    configOverrides
  });
  const outputPath = resolveOutputPath(
    cwd,
    options.output ?? analysis.config.output
  );
  const existingContent = await readTextIfExists(outputPath);
  const generated = await generateReadme(analysis);
  const nextContent =
    options.preserve === false || existingContent === null
      ? generated.content
      : mergeReadme({
          existing: existingContent,
          generated: generated.content,
          protectedSections: analysis.config.protectedSections
        });
  const diff =
    existingContent === null
      ? createDiffSummary("", nextContent)
      : createDiffSummary(existingContent, nextContent);
  const changed = diff !== null;

  if (!options.check) {
    if (
      (await pathExists(outputPath)) &&
      !options.force &&
      changed &&
      existingContent !== null
    ) {
      await writeTextFile(outputPath, nextContent);
    } else if (
      !(await pathExists(outputPath)) ||
      options.force ||
      existingContent === null
    ) {
      await writeTextFile(outputPath, nextContent);
    }
  }

  return {
    changed,
    outputPath,
    content: nextContent,
    warnings: analysis.warnings,
    projectType: analysis.project.primary,
    template: generated.template,
    ...(diff === null ? {} : { diff })
  };
}

function buildConfigOverrides(
  options: GenerateCommandOptions
): Partial<ReadmefyConfig> & {
  badgesEnabled?: boolean;
} {
  return {
    ...(options.output === undefined ? {} : { output: options.output }),
    ...(options.template === undefined ? {} : { template: options.template }),
    ...(options.preserve === undefined ? {} : { preserve: options.preserve }),
    ...(options.badges === undefined ? {} : { badgesEnabled: options.badges })
  };
}
