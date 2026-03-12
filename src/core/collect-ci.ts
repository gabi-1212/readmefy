import path from "node:path";
import { parse } from "yaml";
import type { CIInfo, WorkflowInfo } from "../types/index.js";
import { readTextIfExists } from "../utils/file.js";

export async function collectCI(
  cwd: string,
  workflowFiles: string[]
): Promise<CIInfo> {
  const workflows: WorkflowInfo[] = [];

  for (const workflowFile of workflowFiles.sort((left, right) =>
    left.localeCompare(right)
  )) {
    const content = await readTextIfExists(path.join(cwd, workflowFile));

    if (content === null) {
      continue;
    }

    const parsed = parse(content) as { name?: string; on?: unknown } | null;
    workflows.push({
      name: parsed?.name ?? path.basename(workflowFile),
      file: workflowFile,
      events: normalizeWorkflowEvents(parsed?.on)
    });
  }

  return {
    provider: "github-actions",
    workflows
  };
}

function normalizeWorkflowEvents(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  if (value !== null && typeof value === "object") {
    return Object.keys(value as Record<string, unknown>).sort((left, right) =>
      left.localeCompare(right)
    );
  }

  return [];
}
