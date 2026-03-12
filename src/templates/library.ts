import type { SectionId, TemplateName } from "../types/index.js";

export interface TemplateDefinition {
  name: TemplateName;
  description: string;
  sectionOrder: SectionId[];
}

export const libraryTemplate: TemplateDefinition = {
  name: "library",
  description: "Readable defaults for reusable packages and SDKs.",
  sectionOrder: [
    "badges",
    "overview",
    "features",
    "tech-stack",
    "installation",
    "usage",
    "scripts",
    "structure",
    "development",
    "ci-cd",
    "contributing",
    "security",
    "license"
  ]
};
