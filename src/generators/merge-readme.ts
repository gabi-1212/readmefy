import type { SectionId } from "../types/index.js";

const BLOCK_PATTERN =
  /<!--\s*readmefy:start:([a-z0-9-]+)\s*-->([\s\S]*?)<!--\s*readmefy:end:\1\s*-->/g;

export interface MergeReadmeInput {
  existing: string;
  generated: string;
  protectedSections: SectionId[];
}

export function mergeReadme(input: MergeReadmeInput): string {
  const existingBlocks = extractBlocks(input.existing);
  let result = input.generated;

  for (const sectionId of input.protectedSections) {
    const block = existingBlocks.get(sectionId);

    if (!block) {
      continue;
    }

    result = replaceBlock(result, sectionId, block);
  }

  return result;
}

function extractBlocks(readme: string): Map<string, string> {
  const blocks = new Map<string, string>();

  for (const match of readme.matchAll(BLOCK_PATTERN)) {
    const id = match[1];
    const fullBlock = match[0];
    if (!id) {
      continue;
    }
    blocks.set(id, fullBlock);
  }

  return blocks;
}

function replaceBlock(
  content: string,
  sectionId: string,
  replacement: string
): string {
  const pattern = new RegExp(
    `<!--\\s*readmefy:start:${sectionId}\\s*-->[\\s\\S]*?<!--\\s*readmefy:end:${sectionId}\\s*-->`,
    "g"
  );
  return content.replace(pattern, replacement);
}
