# AGENTS.md

Guidance for AI agents working in this **modular monolith monorepo** (pnpm + Turbo).

## Repository layout

```
apps/api/          NestJS API (@repo/api)
apps/web/          Next.js frontend (@repo/web)
packages/contracts Shared API contracts for web/clients
packages/types     Shared pure types
packages/utils     Shared utilities
infrastructure/    Docker, nginx, Terraform, k8s (not imported by app code)
docs/              Architecture notes
```

## Commands (from repo root)

```bash
pnpm install
pnpm run start:dev          # API with hot reload
pnpm run build              # Turbo: build all packages
pnpm run lint

# API only
pnpm --filter @repo/api run start:prod
pnpm --filter @repo/api run test

# Database (run from root; uses .env.{NODE_ENV} at repo root)
NODE_ENV=development pnpm run migrate:up
NODE_ENV=development pnpm run migrate:generate -- src/shared/infrastructure/database/migrations/my-migration
```

Path alias in API: `@api/*` → `apps/api/src/*`

## API architecture

### Bootstrap (`apps/api/src/bootstrap/`)

- `main.ts` — NestFactory, global pipes, versioning
- `app.module.ts` — imports CoreModule + bounded-context modules
- `core.module.ts` — config, logging (observability), DB, Redis, messaging stub, errors, pagination

### Bounded contexts (`apps/api/src/modules/`)

Each module follows:

```
public/           # Facade + contract — ONLY import surface for other modules
domain/
application/
infrastructure/
presentation/
<name>.module.ts
```

| Module | Notes |
|--------|--------|
| identity | OAuth under `infrastructure/integrations/oauth/` |
| pipeline | Core product; legacy article CRUD in `_article_legacy/` |
| storage | R2 / object storage (scaffold) |
| notifications | Channels (scaffold) |
| billing | Payments (scaffold) |

**Cross-module rule:** import only from `modules/<other>/public/`, never from domain/infrastructure/presentation.

### Shared (`apps/api/src/shared/`)

- `kernel/` — BaseEntity, BaseRepository, DDD primitives
- `application/` — Command, Query, Result helpers
- `infrastructure/` — database, config, cache (Redis), **messaging** (stub), **observability** (Winston/debugger), service-gateway
- `exceptions/` — global error filter
- `utilities/` — pagination, validators, response envelope
- `constants/` — response/error codes

### Jobs (`apps/api/src/jobs/`)

Background job classes live here (not a Nest bounded-context module). Wire to Bull in `shared/infrastructure/messaging` when ready.

### TypeORM

- Config: `apps/api/typeorm.config.ts`
- CLI data source: `apps/api/src/shared/infrastructure/database/data-source.ts`
- Migrations: `apps/api/src/shared/infrastructure/database/migrations/`
- Entities: `**/*.entity.ts` and future `*.orm-entity.ts` under modules

`DatabaseModule` is `@Global()` — inject `TYPEORM` token from `database.provider.ts`.

## Environment

```bash
cd apps/api && cp .env.example .env.development
```

Nest loads `.env.{NODE_ENV}` from **`apps/api/`**. **Wired:** `APP_*`, `DB_*`, `REDIS_*`, `OTHER_SERVICE_URL`. **Template only (modules TBD):** `OAUTH_*`, `JWT_*`, `R2_*`, payments, `BULL_*`, SMTP, `CORS_ORIGIN`.

## Naming conventions

| Target | Convention | Example |
|--------|-----------|---------|
| Folders | kebab-case | `base-repository/` |
| Files | snake_case | `article.service.ts` |
| Classes | PascalCase | `ArticleService` |
| Variables | camelCase | `findArticleById` |
| Interfaces | `i` prefix | `iArticleInfo` |

## Commit convention

Types: `feature`, `fix`, `improve`, `refactor`, `bugfix`, `hotfix` (commitlint enforced via Husky).

## Code rules for agents

- Never import across bounded contexts except through `modules/<name>/public/`.
- New bounded-context modules must follow the `public/domain/application/infrastructure/presentation` layout.
- Do not add error handling for impossible scenarios — trust NestJS pipes and TypeORM guarantees.
- Default to no comments; add one only when the WHY is non-obvious.
- All new files follow the naming conventions table above.
