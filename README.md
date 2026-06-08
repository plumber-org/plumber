# Plumber

A **modular monolith monorepo** for file ingestion, transformation, and delivery.  
Stack: NestJS API · Next.js web · pnpm workspaces · Turbo · PostgreSQL · Redis · TypeORM.

---

## Repository structure

```
apps/
  api/          NestJS backend  (@repo/api)
  web/          Next.js frontend (@repo/web)
packages/
  contracts/    Shared API contracts (request/response types for web & external clients)
  types/        Shared pure TypeScript types
  utils/        Shared utility helpers
infrastructure/ Docker · nginx · Terraform · Kubernetes (not imported by app code)
docs/           Architecture notes
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20 |
| pnpm | 9.15.0 |
| Docker | any recent |

```bash
# activate pnpm via corepack (once per machine)
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

---

## First-time setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy and fill API env (Neon/Postgres, Redis, OAuth, R2, etc.)
cd apps/api
cp .env.example .env.development
# edit .env.development with your values

# 3. Run DB migrations
cd ../..
NODE_ENV=development pnpm run migrate:up
```

> The web app uses a separate `apps/web/.env.local` — copy from `apps/web/.env.example` when that scaffold is wired up.

---

## Development

```bash
# Start API with hot reload
pnpm run start:dev

# Build entire monorepo (all packages, in dependency order)
pnpm run build

# Lint everything
pnpm run lint

# Format everything
pnpm run format

# Run all tests
pnpm run test
```

API is available at: `http://localhost:{APP_PORT}/api/v1/`

---

## Database

```bash
# Apply pending migrations
NODE_ENV=development pnpm run migrate:up

# Revert last migration
NODE_ENV=development pnpm run migrate:down

# Generate a new migration from entity changes
NODE_ENV=development pnpm run migrate:generate -- src/shared/infrastructure/database/migrations/<name>
```

---

## Running a single workspace

```bash
# API only
pnpm --filter @repo/api run start:dev
pnpm --filter @repo/api run test

# Web only
pnpm --filter @repo/web run dev
pnpm --filter @repo/web run test
```

---

## Code quality

| Tool | Config | What it checks |
|------|--------|----------------|
| ESLint | `.eslintrc.js` | TS linting, unused imports |
| Prettier | `.prettierrc` | Formatting |
| Husky | `.husky/` | Pre-commit lint-staged, commit-msg commitlint |
| commitlint | `commitlint.config.ts` | Commit message format |
| Jest | per-package `jest` config | Unit / integration tests |

Commit message format: `<type>: <description>`  
Allowed types: `feature`, `fix`, `improve`, `refactor`, `bugfix`, `hotfix`

---

## Workspaces

| Package | Path | Status |
|---------|------|--------|
| `@repo/api` | `apps/api` | Active |
| `@repo/web` | `apps/web` | Scaffold |
| `@repo/contracts` | `packages/contracts` | Active |
| `@repo/types` | `packages/types` | Active |
| `@repo/utils` | `packages/utils` | Active |

---

## Contributing

1. Branch off `dev`: `git checkout -b feature/your-topic`
2. Make changes — Husky will lint & format on commit
3. Open a PR against `dev`

> For AI-agent context see [AGENTS.md](./AGENTS.md).
