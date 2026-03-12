# CI

## GitHub Actions check mode

Use `readmefy check` in pull requests so documentation drift fails fast:

```yaml
name: README

on:
  pull_request:

jobs:
  readme:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx @gabikamel99/readmefy check
```

## Official action

```yaml
- uses: gabi-1212/readmefy@main
  with:
    mode: check
    cwd: .
```

Inputs:

- `mode`: `generate` or `check`
- `cwd`: repository path to analyze
- `output`: target README file
- `template`: optional template override
- `badges`: `true` or `false`
- `preserve`: `true` or `false`
- `debug`: `true` or `false`

## CI design notes

- `check` mode is deterministic and safe for pull requests.
- Repositories can review README diffs like any other generated asset.
- The action currently builds the package from source to keep its behavior aligned with the tagged source tree.
