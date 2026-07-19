# Contributing to KIRA KIRA

Thanks for your interest in contributing to `kira-arts`. This guide explains the workflow so contributions are easy to review and merge.

## Before you start

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/kira-arts.git
   
   cd kira-arts
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-change-name
   ```

## Branch naming convention

- `feature/*` — new functionality (e.g. `feature/achievement-cards`)
- `fix/*` — bug fixes (e.g. `fix/canvas-render-offset`)
- `docs/*` — documentation-only changes
- `chore/*` — maintenance, dependencies, configuration

## Commit style

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for achievement cards
fix: correct avatar render offset
docs: update README examples
chore: update dependencies
```

This lets us generate changelogs automatically alongside releases.

## Before opening a Pull Request

- Make sure the project builds: `npm run build`
- Check that there are no lint/type errors: `npm run lint`
- If you're adding new functionality, consider including a usage example

## Pull Requests

- All PRs are opened against `main`.
- At least one approved review is required before merging.
- Clearly describe what changes and why (use the PR template).
- If your change is breaking, state it explicitly in the description.

## Reporting bugs or suggesting features

Use the corresponding Issue templates. The more information you provide (Node version, minimal reproduction example, expected vs actual behavior), the faster we can help.

## Code of conduct

Be respectful. Technical discussion is welcome, disrespect is not.
