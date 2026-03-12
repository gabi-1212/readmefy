export function compact<T>(
  values: Array<T | undefined | null | false | "">
): T[] {
  return values.filter(Boolean) as T[];
}

export function toTitleCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function humanizePackageName(value: string): string {
  return toTitleCase(value.replace(/^@/, "").replace(/\//g, " "));
}

export function sentenceCase(value: string): string {
  if (value.length === 0) {
    return value;
  }

  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

export function stripGitPrefix(value: string): string {
  return value.replace(/^git\+/, "").replace(/\.git$/, "");
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}
