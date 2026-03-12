import type { SectionId } from "../types/index.js";
import type { TemplateDefinition } from "./library.js";

export const monorepoTemplate: TemplateDefinition = {
  name: "monorepo",
  description: "Defaults for multi-package workspaces and templates.",
  sectionOrder: [
    "badges",
    "overview",
    "features",
    "tech-stack",
    "installation",
    "quick-start",
    "scripts",
    "environment",
    "structure",
    "development",
    "ci-cd",
    "contributing",
    "security",
    "license"
  ] satisfies SectionId[]
};
