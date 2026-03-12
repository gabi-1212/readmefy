# Contributing

## Principles

- Keep output deterministic.
- Prefer repository facts over heuristics.
- Treat README generation as infrastructure, not content guessing.
- Add or update example fixtures when behavior changes.

## Local setup

```bash
npm install
npm run check
npm run build
npm run verify:examples
```

## Development workflow

1. Make the smallest coherent change.
2. Add or update tests.
3. Regenerate affected example READMEs.
4. Run `npm run check` and `npm run verify:examples`.
5. Open a pull request that explains the repository signal you added or changed.

## Pull request expectations

- Include user-facing impact.
- Note any output changes in generated READMEs.
- Update docs when config or command behavior changes.
- Avoid bundling unrelated refactors with generator changes.

## Project areas

- `src/core`: detectors and collectors
- `src/generators`: Markdown generation and merge behavior
- `src/commands`: CLI surface
- `examples`: checked-in fixtures that double as expected outputs
- `docs`: adoption and architecture docs

## Good first contributions

- Add a detector for an additional config file with tests.
- Improve project structure relevance scoring.
- Tighten merge behavior for additional marker scenarios.
- Expand doctor output with actionable warnings.

## Reporting issues

Use the issue templates for bugs and feature requests. Security reports should follow [SECURITY.md](./SECURITY.md).
