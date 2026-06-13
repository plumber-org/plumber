# Tooling

## Package manager & monorepo

| Tool | Version | Config |
|------|---------|--------|
| pnpm | 9.15.0 | `pnpm-workspace.yaml` |
| Turbo | ^2.x | `turbo.json` |

Turbo pipelines: `build` (depends on `^build`), `lint`, `test` (depends on `^build`), `start:dev` (persistent).

## TypeScript

Base config: `tsconfig.base.json` — extended by each workspace's own `tsconfig.json`.

## Linting & formatting

| Tool | Config file | Scope |
|------|-------------|-------|
| ESLint | `.eslintrc.js` (root) | All `*.ts` / `*.tsx` |
| Prettier | `.prettierrc` (root) | TS, JSON, YAML |

Root ESLint extends `@typescript-eslint/recommended` + `prettier`.  
NestJS files (`apps/api/**`) relax `no-explicit-any` (decorator patterns need it).  
Run: `pnpm run lint` (Turbo) or per-workspace `pnpm --filter @repo/api run lint`.

## Git hooks (Husky + lint-staged)

| Hook | Trigger | Action |
|------|---------|--------|
| `pre-commit` | `git commit` | Run `lint-staged` (ESLint + Prettier on staged files) |
| `commit-msg` | `git commit` | Run `commitlint` to enforce commit format |

Hooks are installed automatically when you run `pnpm install` (via the `prepare` lifecycle script).

Commit message format: `<type>: <description>`  
Allowed types: `feature` · `fix` · `improve` · `refactor` · `bugfix` · `hotfix`

## Testing (Jest)

| Workspace | Test pattern | Environment |
|-----------|-------------|-------------|
| `@repo/api` | `src/**/*.spec.ts` | node |
| `@repo/web` | `src/**/*.spec.(ts\|tsx)` | jsdom |

Run all tests: `pnpm run test`  
Run per-workspace: `pnpm --filter @repo/api run test`

Coverage reports are written to each workspace's `coverage/` directory (gitignored).

## Static analysis

SonarQube config: `sonar-project.js` (CI-only, not required locally).

## Activating hooks after clone

```bash
pnpm install   # runs `husky install` via prepare
```
