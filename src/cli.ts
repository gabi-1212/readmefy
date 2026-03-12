import process from "node:process";
import { Command } from "commander";
import { runCheckCommand } from "./commands/check.js";
import { runDoctorCommand } from "./commands/doctor.js";
import { runGenerateCommand } from "./commands/generate.js";
import { runInitCommand } from "./commands/init.js";
import { createLogger } from "./utils/logger.js";
import type { GenerateCommandOptions, TemplateName } from "./types/index.js";

const program = new Command();

program
  .name("readmefy")
  .description(
    "Generate and maintain deterministic README.md files from real repositories."
  )
  .version("0.1.0");

program
  .command("generate", { isDefault: true })
  .description("Generate or update a README.md file")
  .option("--output <file>", "Write output to a specific file")
  .option("--force", "Write even when the README already exists", false)
  .option("--check", "Run in check mode without writing files", false)
  .option("--json", "Print JSON output", false)
  .option("--template <name>", "Template override: library, app, cli, monorepo")
  .option("--no-badges", "Disable badge generation")
  .option("--preserve", "Preserve protected marker blocks", true)
  .option("--cwd <path>", "Run from a different working directory")
  .option("--debug", "Enable debug logging", false)
  .action(async (options) => {
    await handleGenerate(normalizeOptions(options));
  });

program
  .command("check")
  .description("Fail when the current README.md is out of date")
  .option("--output <file>", "Compare against a specific file")
  .option("--json", "Print JSON output", false)
  .option("--template <name>", "Template override: library, app, cli, monorepo")
  .option("--no-badges", "Disable badge generation")
  .option("--preserve", "Preserve protected marker blocks", true)
  .option("--cwd <path>", "Run from a different working directory")
  .option("--debug", "Enable debug logging", false)
  .action(async (options) => {
    const result = await runCheckCommand(normalizeOptions(options));
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      process.exitCode = result.changed ? 1 : 0;
      return;
    }

    if (result.changed) {
      console.error(`README is out of date: ${result.outputPath}`);
      if (result.diff) {
        console.error(result.diff.message);
        console.error("Expected:");
        console.error(result.diff.expectedSnippet.join("\n"));
        console.error("Actual:");
        console.error(result.diff.actualSnippet.join("\n"));
      }
      process.exitCode = 1;
      return;
    }

    console.log(`README is current: ${result.outputPath}`);
  });

program
  .command("init")
  .description("Create a starter readmefy config")
  .option("--force", "Overwrite an existing config", false)
  .option("--json", "Print JSON output", false)
  .option("--template <name>", "Template override: library, app, cli, monorepo")
  .option("--no-badges", "Disable badge generation")
  .option("--cwd <path>", "Run from a different working directory")
  .option("--debug", "Enable debug logging", false)
  .action(async (options) => {
    const result = await runInitCommand(normalizeOptions(options));
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log(
      result.created
        ? `Created ${result.outputPath} using the ${result.template} template.`
        : `Config already exists: ${result.outputPath}`
    );
  });

program
  .command("doctor")
  .description("Inspect repository metadata and show what readmefy can detect")
  .option("--json", "Print JSON output", false)
  .option("--template <name>", "Template override: library, app, cli, monorepo")
  .option("--no-badges", "Disable badge generation")
  .option("--cwd <path>", "Run from a different working directory")
  .option("--debug", "Enable debug logging", false)
  .action(async (options) => {
    const logger = createLogger(Boolean(options.debug));
    const result = await runDoctorCommand(normalizeOptions(options));
    logger.debug(`Analysed ${result.cwd}`);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    console.log(`Project: ${result.title}`);
    console.log(`Primary type: ${result.projectType}`);
    console.log(`Template: ${result.template}`);
    console.log(`Package manager: ${result.packageManager}`);
    console.log(
      `Frameworks: ${result.frameworks.join(", ") || "None detected"}`
    );
    console.log(`Detected files: ${result.detectedFiles.join(", ") || "None"}`);

    if (result.warnings.length > 0) {
      console.log("Warnings:");
      for (const warning of result.warnings) {
        console.log(`- ${warning}`);
      }
    }
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

async function handleGenerate(options: GenerateCommandOptions): Promise<void> {
  const result = await runGenerateCommand(options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    if (options.check && result.changed) {
      process.exitCode = 1;
    }
    return;
  }

  if (options.check) {
    if (result.changed) {
      console.error(`README is out of date: ${result.outputPath}`);
      if (result.diff) {
        console.error(result.diff.message);
      }
      process.exitCode = 1;
      return;
    }

    console.log(`README is current: ${result.outputPath}`);
    return;
  }

  console.log(`README written to ${result.outputPath}`);

  if (result.warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of result.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

function normalizeOptions(
  input: Record<string, unknown>
): GenerateCommandOptions {
  return {
    ...(typeof input.output === "string" ? { output: input.output } : {}),
    ...(typeof input.force === "boolean" ? { force: input.force } : {}),
    ...(typeof input.check === "boolean" ? { check: input.check } : {}),
    ...(typeof input.json === "boolean" ? { json: input.json } : {}),
    ...(typeof input.template === "string"
      ? { template: input.template as TemplateName }
      : {}),
    ...(typeof input.badges === "boolean" ? { badges: input.badges } : {}),
    ...(typeof input.preserve === "boolean"
      ? { preserve: input.preserve }
      : {}),
    ...(typeof input.cwd === "string" ? { cwd: input.cwd } : {}),
    ...(typeof input.debug === "boolean" ? { debug: input.debug } : {})
  };
}
