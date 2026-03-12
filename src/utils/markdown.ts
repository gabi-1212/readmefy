import prettier from "prettier";
import type { SectionId } from "../types/index.js";

export function wrapManagedSection(
  id: SectionId,
  title: string,
  body: string
): string {
  return [
    `<!-- readmefy:start:${id} -->`,
    `## ${title}`,
    "",
    body.trim(),
    `<!-- readmefy:end:${id} -->`
  ].join("\n");
}

export function codeFence(language: string, content: string): string {
  return ["```" + language, content.trimEnd(), "```"].join("\n");
}

export function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function table(headers: string[], rows: string[][]): string {
  const headerRow = `| ${headers.join(" | ")} |`;
  const separator = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
  return [headerRow, separator, body].filter(Boolean).join("\n");
}

export async function formatMarkdown(markdown: string): Promise<string> {
  return prettier.format(markdown, {
    parser: "markdown",
    proseWrap: "preserve"
  });
}
