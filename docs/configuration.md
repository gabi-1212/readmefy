# Configuration

`readmefy` loads configuration from:

- `readmefy.config.ts`
- `readmefy.config.js`
- `readmefy.config.mjs`
- `readmefy.config.cjs`
- `readmefy.config.json`

## Example

```ts
import type { ReadmefyConfig } from "@gabikamel99/readmefy";

const config: ReadmefyConfig = {
  template: "library",
  customIntro: "Deterministic Markdown helpers for internal design systems.",
  protectedSections: ["overview", "usage"],
  sectionOrder: [
    "badges",
    "overview",
    "features",
    "installation",
    "usage",
    "scripts",
    "license"
  ],
  sections: {
    environment: false,
    "quick-start": false
  },
  badgeConfiguration: {
    ci: true,
    license: true,
    npm: true
  },
  structure: {
    maxDepth: 2,
    maxEntriesPerDirectory: 6,
    include: ["src", "tests", "docs"],
    exclude: ["dist", "coverage"]
  }
};

export default config;
```

## Keys

- `title`: override the generated title
- `customIntro`: replace the generated overview text
- `why`: add a dedicated "Why This Project Exists" section
- `features`: provide explicit feature bullets instead of derived ones
- `template`: choose `library`, `app`, `cli`, or `monorepo`
- `output`: default output path
- `preserve`: keep protected marker blocks when a README already exists
- `protectedSections`: section ids that should keep user-authored content
- `sectionOrder`: explicit section ordering
- `sections`: enable or disable individual sections
- `badgeConfiguration`: enable badge families
- `structure`: tune project structure depth and directory inclusion

## Protected sections

When `preserve` is enabled, `readmefy` replaces managed sections except those listed in `protectedSections`. Existing content inside those markers is kept:

```md
<!-- readmefy:start:overview -->

## Overview

Maintainer-authored overview content.

<!-- readmefy:end:overview -->
```
