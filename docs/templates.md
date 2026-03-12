# Templates

Templates only control section ordering and defaults. Repository analysis still determines which sections have enough signal to render.

## `library`

Best for packages, SDKs, utilities, and reusable modules.

Typical sections:

- overview
- features
- tech stack
- installation
- usage
- scripts
- structure

## `app`

Best for services, websites, and deployable applications.

Typical sections:

- overview
- installation
- quick start
- usage
- scripts
- environment
- structure
- CI/CD notes

## `cli`

Best for repositories with a `bin` entry or command-oriented UX.

Typical sections:

- overview
- installation
- quick start
- usage
- CLI usage
- scripts
- structure

## `monorepo`

Best for workspaces using `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, or multiple nested packages.

Typical sections:

- overview
- features
- installation
- scripts
- structure
- development
- CI/CD notes
