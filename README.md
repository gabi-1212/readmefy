# readmefy

[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./LICENSE)
[![CI](https://github.com/gabi-1212/readmefy/actions/workflows/ci.yml/badge.svg)](https://github.com/gabi-1212/readmefy/actions/workflows/ci.yml)

`readmefy` is README infrastructure for real repositories.

It scans checked-in project files, infers the repository shape, and generates a deterministic `README.md` that teams can review in pull requests and enforce in CI. It does not call AI services, execute repository code, or invent project details that are not present on disk.

## Why readmefy is different

Most README generators are one-shot scaffolds. `readmefy` is built to be rerun safely across mature repositories:

- Deterministic Markdown output with stable section ordering and formatting
- Zero-config analysis across Node, Next.js, Vite, monorepos, Python, Rust, Go, and Dockerized services
- Merge behavior that preserves protected user-authored sections with markers
- `check` mode designed for CI and GitHub Actions
- Example-driven test coverage so output changes stay reviewable

## Quick start

```bash
npx @gabikamel99/readmefy
```

Or install it in your project and use the local binary:

```bash
npm install --save-dev @gabikamel99/readmefy
npx readmefy
```

Generate explicitly:

```bash
readmefy generate
```

Fail CI when the README is stale:

```bash
readmefy check
```

Bootstrap config:

```bash
readmefy init
```

Inspect repository detection:

```bash
readmefy doctor
```

## What it generates

`readmefy` can emit and maintain these sections when the repository provides enough signal:

- Title
- Badges
- Overview
- Why this project exists
- Features
- Tech stack
- Installation
- Quick start
- Usage
- CLI usage
- Available scripts
- Environment variables
- Project structure
- Development workflow
- CI/CD notes
- Contributing
- Security
- License

## Before and after

Before:

```md
# project

todo
```

After:

```md
# Customer Portal

<!-- readmefy:start:overview -->

## Overview

Customer-facing Next.js portal with authenticated account flows.

<!-- readmefy:end:overview -->

<!-- readmefy:start:scripts -->

## Available Scripts

| Script | Command      | Source       |
| ------ | ------------ | ------------ |
| build  | `next build` | package.json |
| dev    | `next dev`   | package.json |
| lint   | `eslint .`   | package.json |
| start  | `next start` | package.json |

<!-- readmefy:end:scripts -->
```

## Protected markers

Wrap any section you want to keep under human control with `readmefy` markers. When `preserve` is enabled, existing content for protected sections is kept intact on regeneration.

```md
<!-- readmefy:start:overview -->

## Overview

This paragraph is maintained by a human and will be preserved.

<!-- readmefy:end:overview -->
```

Default protected sections:

- `overview`
- `why`

## Configuration

Create `readmefy.config.json`, `readmefy.config.js`, or `readmefy.config.ts`:

```json
{
  "template": "cli",
  "customIntro": "Repository-grade environment checks for release pipelines.",
  "protectedSections": ["overview", "why", "usage"],
  "badgeConfiguration": {
    "ci": true,
    "npm": true
  },
  "sections": {
    "environment": true,
    "cli-usage": true
  }
}
```

More detail is in [docs/configuration.md](./docs/configuration.md).

## GitHub Action

The repo ships an official action for README generation and check mode:

```yaml
name: README

on:
  pull_request:
  push:
    branches: [main]

jobs:
  readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gabi-1212/readmefy@main
        with:
          mode: check
```

The action currently builds the package from source inside `github.action_path` to keep behavior transparent and aligned with the published CLI. Usage notes are in [docs/ci.md](./docs/ci.md).

## CLI reference

```bash
readmefy [options]
readmefy generate [options]
readmefy check [options]
readmefy init [options]
readmefy doctor [options]
```

Key flags:

- `--output <file>`
- `--force`
- `--check`
- `--json`
- `--template <name>`
- `--no-badges`
- `--preserve`
- `--cwd <path>`
- `--debug`

## Templates

- `library`: packages and reusable modules
- `app`: deployable apps and services
- `cli`: installable command-line tools
- `monorepo`: multi-package workspaces

See [docs/templates.md](./docs/templates.md) for the section layouts and when to use each one.

## Architecture

`readmefy` is intentionally small and explicit:

- `src/core`: repository analysis and detectors
- `src/generators`: Markdown rendering and merge logic
- `src/commands`: CLI command handlers
- `examples`: realistic fixtures used as checked-in output snapshots
- `tests`: unit, integration, and CLI coverage

The design notes are in [docs/architecture.md](./docs/architecture.md).

## Docs

- [docs/getting-started.md](./docs/getting-started.md)
- [docs/configuration.md](./docs/configuration.md)
- [docs/templates.md](./docs/templates.md)
- [docs/ci.md](./docs/ci.md)
- [docs/architecture.md](./docs/architecture.md)

## Roadmap

The immediate roadmap is focused on adoption, trust, and contributor leverage:

- richer language detectors
- richer diff output for CI
- custom badge providers
- monorepo package rollups
- improved config validation

The detailed roadmap is in [ROADMAP.md](./ROADMAP.md).

## Contributing

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [SECURITY.md](./SECURITY.md)
- [SUPPORT.md](./SUPPORT.md)

## License

MIT, see [LICENSE](./LICENSE).
