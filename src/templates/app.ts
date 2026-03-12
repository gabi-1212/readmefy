import type { SectionId } from "../types/index.js";
import type { TemplateDefinition } from "./library.js";

export const appTemplate: TemplateDefinition = {
  name: "app",
  description: "Defaults for deployable apps and services.",
  sectionOrder: [
    "badges",
    "overview",
    "features",
    "tech-stack",
    "installation",
    "quick-start",
    "usage",
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
