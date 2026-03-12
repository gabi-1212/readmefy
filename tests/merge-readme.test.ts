import { describe, expect, it } from "vitest";
import { mergeReadme } from "../src/generators/merge-readme.js";

describe("mergeReadme", () => {
  it("preserves protected blocks from an existing README", () => {
    const existing = [
      "# Demo",
      "",
      "<!-- readmefy:start:overview -->",
      "## Overview",
      "",
      "Custom overview text.",
      "<!-- readmefy:end:overview -->"
    ].join("\n");
    const generated = [
      "# Demo",
      "",
      "<!-- readmefy:start:overview -->",
      "## Overview",
      "",
      "Generated overview text.",
      "<!-- readmefy:end:overview -->"
    ].join("\n");

    const merged = mergeReadme({
      existing,
      generated,
      protectedSections: ["overview"]
    });

    expect(merged).toContain("Custom overview text.");
    expect(merged).not.toContain("Generated overview text.");
  });
});
