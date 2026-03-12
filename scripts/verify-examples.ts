import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCheckCommand } from "../src/commands/check.js";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const examples = [
  "nextjs-app",
  "npm-library",
  "cli-tool",
  "monorepo",
  "python-package"
];

async function main(): Promise<void> {
  for (const example of examples) {
    const cwd = path.join(projectRoot, "examples", example);
    const result = await runCheckCommand({
      cwd,
      output: "README.md"
    });

    if (result.changed) {
      throw new Error(
        `Example README is stale for ${example}: ${result.outputPath}`
      );
    }
  }
}

await main();
