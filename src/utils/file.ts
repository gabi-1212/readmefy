import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function readTextIfExists(
  targetPath: string
): Promise<string | null> {
  try {
    return await readFile(targetPath, "utf8");
  } catch {
    return null;
  }
}

export async function readJsonFile<T>(targetPath: string): Promise<T | null> {
  const content = await readTextIfExists(targetPath);

  if (content === null) {
    return null;
  }

  return JSON.parse(content) as T;
}

export async function writeTextFile(
  targetPath: string,
  content: string
): Promise<void> {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await writeFile(targetPath, ensureTrailingNewline(content), "utf8");
}

export function ensureTrailingNewline(value: string): string {
  return value.endsWith("\n") ? value : `${value}\n`;
}

export function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n/g, "\n");
}
