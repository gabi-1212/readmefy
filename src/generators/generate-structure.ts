import type { StructureNode } from "../types/index.js";
import { codeFence } from "../utils/markdown.js";

export function generateStructure(structure: StructureNode[]): string {
  if (structure.length === 0) {
    return "";
  }

  const lines = [".", ...renderNodes(structure, "")];
  return codeFence("text", lines.join("\n"));
}

function renderNodes(nodes: StructureNode[], prefix: string): string[] {
  const lines: string[] = [];

  nodes.forEach((node, index) => {
    const connector = index === nodes.length - 1 ? "└── " : "├── ";
    const nextPrefix = `${prefix}${index === nodes.length - 1 ? "    " : "│   "}`;
    lines.push(`${prefix}${connector}${node.name}`);

    if (node.children.length > 0) {
      lines.push(...renderNodes(node.children, nextPrefix));
    }
  });

  return lines;
}
