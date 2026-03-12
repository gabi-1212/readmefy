import path from "node:path";
import type { CommandResult, GenerateCommandOptions } from "../types/index.js";
import { runGenerateCommand } from "./generate.js";

export async function runCheckCommand(
  options: GenerateCommandOptions
): Promise<CommandResult> {
  return runGenerateCommand({
    ...options,
    cwd: path.resolve(options.cwd ?? process.cwd()),
    check: true
  });
}
