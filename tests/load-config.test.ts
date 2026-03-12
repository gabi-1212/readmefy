import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "../src/config/load-config.js";

const temporaryDirectories: string[] = [];

describe("loadConfig", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directory) =>
          import("node:fs/promises").then(({ rm }) =>
            rm(directory, { recursive: true, force: true })
          )
        )
    );
  });

  it("loads JSON config overrides", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "readmefy-config-"));
    temporaryDirectories.push(directory);
    await writeFile(
      path.join(directory, "readmefy.config.json"),
      JSON.stringify(
        {
          template: "cli",
          protectedSections: ["overview", "usage"]
        },
        null,
        2
      )
    );

    const { config } = await loadConfig({ cwd: directory });

    expect(config.template).toBe("cli");
    expect(config.protectedSections).toEqual(["overview", "usage"]);
  });
});
