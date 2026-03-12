import path from "node:path";

export function normalizePath(value: string): string {
  return value.split(path.sep).join("/");
}

export function relativeToCwd(cwd: string, target: string): string {
  const relative = path.relative(cwd, target);
  return normalizePath(relative.length === 0 ? "." : relative);
}

export function resolveOutputPath(cwd: string, output: string): string {
  return path.isAbsolute(output) ? output : path.join(cwd, output);
}
