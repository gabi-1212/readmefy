import type { RepoAnalysis } from "../types/index.js";

export function generateBadges(analysis: RepoAnalysis): string[] {
  if (!analysis.config.badgeConfiguration.enabled) {
    return [];
  }

  const badges: string[] = [];
  const packageName = analysis.packageManifest?.name;

  if (
    analysis.config.badgeConfiguration.npm &&
    packageName &&
    analysis.packageManifest?.private !== true &&
    (analysis.project.primary === "node-library" ||
      analysis.project.primary === "cli-tool")
  ) {
    const encoded = encodeURIComponent(packageName);
    badges.push(
      `[![npm version](https://img.shields.io/npm/v/${encoded}?logo=npm)](https://www.npmjs.com/package/${encoded})`
    );
  }

  if (
    analysis.config.badgeConfiguration.license &&
    analysis.license.spdx !== "UNLICENSED"
  ) {
    const label = encodeURIComponent(analysis.license.spdx);
    badges.push(
      `[![License](https://img.shields.io/badge/license-${label}-brightgreen.svg)](./LICENSE)`
    );
  }

  if (
    analysis.config.badgeConfiguration.ci &&
    analysis.repository &&
    analysis.ci.workflows.length > 0
  ) {
    const workflow = analysis.ci.workflows[0];
    if (!workflow) {
      return badges;
    }
    const workflowPath = encodeURIComponent(workflow.file);
    badges.push(
      `[![CI](https://github.com/${analysis.repository.owner}/${analysis.repository.repo}/actions/workflows/${workflowPath}/badge.svg)](${analysis.repository.url}/actions/workflows/${workflow.file})`
    );
  }

  return badges;
}
