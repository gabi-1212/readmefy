import { appTemplate } from "../templates/app.js";
import { cliTemplate } from "../templates/cli.js";
import { libraryTemplate } from "../templates/library.js";
import { monorepoTemplate } from "../templates/monorepo.js";
import type { ResolvedConfig, TemplateName } from "../types/index.js";

export const templateDefinitions = {
  library: libraryTemplate,
  app: appTemplate,
  cli: cliTemplate,
  monorepo: monorepoTemplate
} as const satisfies Record<TemplateName, typeof libraryTemplate>;

export const defaultConfig: ResolvedConfig = {
  features: [],
  template: "app",
  output: "README.md",
  preserve: true,
  sectionOrder: appTemplate.sectionOrder,
  protectedSections: ["overview", "why"],
  sections: {
    badges: true,
    overview: true,
    why: true,
    features: true,
    "tech-stack": true,
    installation: true,
    "quick-start": true,
    usage: true,
    "cli-usage": true,
    scripts: true,
    environment: true,
    structure: true,
    development: true,
    "ci-cd": true,
    contributing: true,
    security: true,
    license: true
  },
  badgeConfiguration: {
    enabled: true,
    npm: true,
    license: true,
    ci: true
  },
  structure: {
    maxDepth: 3,
    maxEntriesPerDirectory: 8,
    include: [
      "app",
      "src",
      "packages",
      "apps",
      "bin",
      "lib",
      "tests",
      "docs",
      ".github",
      "cmd"
    ],
    exclude: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      ".next",
      ".turbo",
      ".git"
    ]
  }
};
