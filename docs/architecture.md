# Architecture

## Goals

- deterministic output
- fast repository analysis
- no code execution in the target repository
- clear separation between detection, rendering, and command behavior

## Modules

### `src/core`

Repository scanners and collectors:

- detect package manager, frameworks, and project type
- collect scripts, environment variables, CI workflows, license data, CLI metadata, and project structure
- normalize metadata for the generator layer

### `src/generators`

Markdown rendering and merge behavior:

- section-specific rendering functions
- badge generation with repository-aware guards
- structure rendering
- marker-aware merge logic for protected sections

### `src/commands`

Command handlers for `generate`, `check`, `init`, and `doctor`.

### `examples`

Realistic fixture repositories used as committed expected outputs. These are part of the product contract because generator changes must keep them stable or update them intentionally.

### `tests`

- unit tests for detectors and merge behavior
- fixture-driven integration tests
- CLI tests

## Determinism choices

- stable file ordering from `fast-glob`
- explicit template section order
- Markdown formatted through Prettier
- merge behavior limited to explicit marker ids
- repository analysis only reads files, never executes them
