# Getting Started

## Install

```bash
npm install --save-dev @gabikamel99/readmefy
```

Or run it without installation:

```bash
npx @gabikamel99/readmefy
```

## Generate a README

```bash
readmefy generate
```

The default target is `README.md` in the working directory. Use `--cwd` to analyze a different repository and `--output` to write somewhere else.

## Check mode

```bash
readmefy check
```

This compares the current file on disk with the expected generated content and exits with code `1` when they differ.

## Initialize config

```bash
readmefy init
```

This writes a starter `readmefy.config.json` with the detected template and a default protected section list.

## Inspect repository detection

```bash
readmefy doctor --json
```

Use this when adding support for a new repository pattern or debugging why a section did or did not render.
