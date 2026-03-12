import path from "node:path";
import jiti from "jiti";
import { defaultConfig, templateDefinitions } from "./defaults.js";
import type {
  ReadmefyConfig,
  ResolvedConfig,
  TemplateName
} from "../types/index.js";
import { pathExists, readJsonFile } from "../utils/file.js";

const CONFIG_FILENAMES = [
  "readmefy.config.ts",
  "readmefy.config.js",
  "readmefy.config.mjs",
  "readmefy.config.cjs",
  "readmefy.config.json"
] as const;

export interface LoadConfigOptions {
  cwd: string;
  overrides?: Partial<ReadmefyConfig> & {
    badgesEnabled?: boolean;
  };
}

export interface LoadConfigResult {
  config: ResolvedConfig;
  configPath: string | null;
}

export async function loadConfig(
  options: LoadConfigOptions
): Promise<LoadConfigResult> {
  const configPath = await findConfigPath(options.cwd);
  const fileConfig =
    configPath === null ? {} : await loadConfigFile(configPath);
  const merged = mergeConfig(defaultConfig, fileConfig);
  const withTemplate = applyTemplateDefaults(merged, merged.template);
  const finalConfig = applyOverrides(withTemplate, options.overrides ?? {});
  return {
    config: finalConfig,
    configPath
  };
}

async function findConfigPath(cwd: string): Promise<string | null> {
  for (const filename of CONFIG_FILENAMES) {
    const candidate = path.join(cwd, filename);
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  return null;
}

async function loadConfigFile(configPath: string): Promise<ReadmefyConfig> {
  if (configPath.endsWith(".json")) {
    return (await readJsonFile<ReadmefyConfig>(configPath)) ?? {};
  }

  const runtime = jiti(configPath, {
    interopDefault: true
  });
  const loaded = (await runtime.import(configPath)) as unknown;

  if (loaded && typeof loaded === "object" && "default" in loaded) {
    return (loaded as { default?: ReadmefyConfig }).default ?? {};
  }

  return (loaded as ReadmefyConfig) ?? {};
}

function applyTemplateDefaults(
  config: ResolvedConfig,
  templateName: TemplateName
): ResolvedConfig {
  return {
    ...config,
    template: templateName,
    sectionOrder:
      config.sectionOrder.length > 0
        ? config.sectionOrder
        : templateDefinitions[templateName].sectionOrder
  };
}

function applyOverrides(
  config: ResolvedConfig,
  overrides: Partial<ReadmefyConfig> & { badgesEnabled?: boolean }
): ResolvedConfig {
  const nextConfig = mergeConfig(config, overrides);

  if (typeof overrides.badgesEnabled === "boolean") {
    nextConfig.badgeConfiguration.enabled = overrides.badgesEnabled;
    nextConfig.sections.badges = overrides.badgesEnabled;
  }

  if (nextConfig.sectionOrder.length === 0) {
    nextConfig.sectionOrder =
      templateDefinitions[nextConfig.template].sectionOrder;
  }

  return nextConfig;
}

function mergeConfig(
  base: ResolvedConfig,
  override: Partial<ReadmefyConfig>
): ResolvedConfig {
  const template = override.template ?? base.template;

  return {
    ...base,
    ...(override.title === undefined ? {} : { title: override.title }),
    ...(override.customIntro === undefined
      ? {}
      : { customIntro: override.customIntro }),
    ...(override.why === undefined ? {} : { why: override.why }),
    features: override.features ?? base.features,
    template,
    output: override.output ?? base.output,
    preserve: override.preserve ?? base.preserve,
    sectionOrder:
      override.sectionOrder ?? templateDefinitions[template].sectionOrder,
    protectedSections: override.protectedSections ?? base.protectedSections,
    sections: {
      ...base.sections,
      ...(override.sections ?? {})
    },
    badgeConfiguration: {
      ...base.badgeConfiguration,
      ...(override.badgeConfiguration ?? {})
    },
    structure: {
      ...base.structure,
      ...(override.structure ?? {})
    }
  };
}
