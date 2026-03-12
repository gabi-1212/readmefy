export function createHeading(value: string, level = 2): string {
  return `${"#".repeat(level)} ${value}`;
}

export function createChecklist(items: string[]): string {
  return items.map((item) => `- [ ] ${item}`).join("\n");
}

export const MARKDOWN_KIT_VERSION = "1.4.0";
