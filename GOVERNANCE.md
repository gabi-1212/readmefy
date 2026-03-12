# Governance

## Vision

`readmefy` aims to become dependable README automation infrastructure for open-source repositories, internal templates, and multi-repository engineering platforms.

## Maintainer model

The project uses a maintainer-led model:

- Maintainers are responsible for release decisions, roadmap curation, and final review on behavior changes.
- Contributors are encouraged to propose detectors, templates, fixtures, and docs improvements through issues and pull requests.
- Changes that alter generated Markdown shape should include fixture updates and rationale.

## Decision-making

- Small changes can be merged by a maintainer after review and green CI.
- Changes that alter section ordering, merge behavior, or default heuristics should be discussed in an issue before implementation.
- Security fixes may follow a private review process until disclosure is safe.

## Release policy

- Patch releases cover fixes and detector improvements that do not intentionally break output contracts.
- Minor releases may add new sections, templates, and config capabilities.
- Breaking output or API changes should be called out clearly in the changelog and release notes.
