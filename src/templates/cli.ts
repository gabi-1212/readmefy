import type { SectionId } from "../types/index.js";
import type { TemplateDefinition } from "./library.js";

export const cliTemplate: TemplateDefinition = {
  name: "cli",
  description: "Defaults for installable command-line tools.",
  sectionOrder: [
    "badges",
    "overview",
    "features",
    "tech-stack",
    "installation",
    "quick-start",
    "usage",
    "cli-usage",
    "scripts",
    "structure",
    "development",
    "ci-cd",
    "contributing",
    "security",
    "license"
  ] satisfies SectionId[]
};
