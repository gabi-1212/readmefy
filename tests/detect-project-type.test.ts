import { describe, expect, it } from "vitest";
import { detectProjectType } from "../src/core/detect-project-type.js";

describe("detectProjectType", () => {
  it("detects CLI repositories from package bin fields", () => {
    const result = detectProjectType({
      packageManifest: {
        name: "env-doctor",
        bin: {
          "env-doctor": "./dist/cli.js"
        }
      },
      detectedFiles: ["package.json"],
      workspacePackageCount: 1,
      hasCli: true
    });

    expect(result.primary).toBe("cli-tool");
    expect(result.template).toBe("cli");
  });

  it("detects monorepos ahead of app markers", () => {
    const result = detectProjectType({
      packageManifest: {
        name: "platform",
        private: true,
        workspaces: ["apps/*", "packages/*"]
      },
      detectedFiles: ["package.json", "turbo.json"],
      workspacePackageCount: 3,
      hasCli: false
    });

    expect(result.primary).toBe("monorepo");
    expect(result.template).toBe("monorepo");
  });
});
