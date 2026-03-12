import { describe, expect, it } from "vitest";
import { analyzeRepo } from "../src/core/analyze-repo.js";
import { generateReadme } from "../src/generators/generate-readme.js";
import { examplePath } from "./helpers.js";

describe("generateReadme", () => {
  it("includes CLI usage for CLI repositories", async () => {
    const analysis = await analyzeRepo({
      cwd: examplePath("cli-tool")
    });
    const result = await generateReadme(analysis);

    expect(result.content).toContain("## CLI Usage");
    expect(result.content).toContain("env-doctor --help");
  });

  it("includes import usage for libraries", async () => {
    const analysis = await analyzeRepo({
      cwd: examplePath("npm-library")
    });
    const result = await generateReadme(analysis);

    expect(result.content).toContain('from "@acme/markdown-kit";');
    expect(result.content).toContain("createChecklist");
    expect(result.content).toContain("createHeading");
    expect(result.content).toContain("MARKDOWN_KIT_VERSION");
  });
});
