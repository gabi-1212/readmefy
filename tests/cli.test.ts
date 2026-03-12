import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copyExample, projectRoot, removeTempDir } from "./helpers.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const tempDirectories: string[] = [];

describe("CLI", () => {
  afterEach(async () => {
    await Promise.all(
      tempDirectories.splice(0).map((directory) => removeTempDir(directory))
    );
  });

  it("generates a README into a custom output file", async () => {
    const cwd = await copyExample("npm-library");
    tempDirectories.push(cwd);
    const outputPath = path.join(cwd, "README.generated.md");

    await execFileAsync(
      process.execPath,
      [
        "--import",
        "tsx",
        "src/cli.ts",
        "generate",
        "--cwd",
        cwd,
        "--output",
        outputPath
      ],
      {
        cwd: projectRoot
      }
    );

    const generated = await readFile(outputPath, "utf8");
    expect(generated).toContain("# Acme Markdown Kit");
  });

  it("returns a non-zero exit code when README is stale", async () => {
    const cwd = await copyExample("cli-tool");
    tempDirectories.push(cwd);
    await writeFile(path.join(cwd, "README.md"), "# stale\n");

    await expect(
      execFileAsync(
        process.execPath,
        ["--import", "tsx", "src/cli.ts", "check", "--cwd", cwd],
        {
          cwd: projectRoot
        }
      )
    ).rejects.toMatchObject({
      code: 1
    });
  });
});
