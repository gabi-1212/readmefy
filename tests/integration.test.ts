import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { analyzeRepo } from "../src/core/analyze-repo.js";
import { generateReadme } from "../src/generators/generate-readme.js";
import { examplePath } from "./helpers.js";

const examples = [
  "nextjs-app",
  "npm-library",
  "cli-tool",
  "monorepo",
  "python-package"
] as const;

describe("example snapshots", () => {
  for (const example of examples) {
    it(`matches the checked-in README for ${example}`, async () => {
      const cwd = examplePath(example);
      const analysis = await analyzeRepo({ cwd });
      const generated = await generateReadme(analysis);
      const expected = await readFile(path.join(cwd, "README.md"), "utf8");

      expect(generated.content).toBe(expected);
    });
  }
});
