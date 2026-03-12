import { cp, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

export function examplePath(name: string): string {
  return path.join(projectRoot, "examples", name);
}

export async function copyExample(name: string): Promise<string> {
  const source = examplePath(name);
  const destination = await mkdtemp(
    path.join(os.tmpdir(), `readmefy-${name}-`)
  );
  await cp(source, destination, { recursive: true });
  return destination;
}

export async function removeTempDir(targetPath: string): Promise<void> {
  await rm(targetPath, { recursive: true, force: true });
}
