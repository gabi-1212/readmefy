export function formatWorkspaceName(workspace: string): string {
  return workspace.replace(/^@acme\//, "");
}
