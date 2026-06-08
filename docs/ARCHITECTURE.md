# Architecture

Modular monolith monorepo for Plumber.

## Layout

```
apps/
  api/          NestJS API (bounded contexts under src/modules/)
  web/          Next.js frontend
packages/
  contracts/    Shared API request/response types for web & external clients
  types/        Shared pure TypeScript types (no runtime code)
  utils/        Shared utility helpers
infrastructure/ Docker · nginx · Terraform · k8s  (ops only, not imported by app code)
docs/           Architecture notes
```

## API internal structure

```
apps/api/src/
  bootstrap/          NestFactory setup, global pipes, versioning
  modules/            Bounded contexts (one folder per domain)
    <name>/
      public/         Facade + exported contracts — the ONLY valid import target
      domain/         Entities, value objects, domain services
      application/    Commands, queries, handlers
      infrastructure/ Repos, integrations, ORM adapters
      presentation/   Controllers, DTOs, guards
      <name>.module.ts
  shared/
    kernel/           BaseEntity, BaseRepository, DDD primitives
    application/      Command/Query/Result helpers
    infrastructure/   DB, config, Redis, messaging stub, observability
    exceptions/       Global error filter
    utilities/        Pagination, validators, response envelope
    constants/        Response and error codes
  jobs/               Background job handlers (wired to Bull when ready)
```

## Module rules

1. Other modules may import **only** from `modules/<name>/public/` — never from domain, infrastructure, or presentation layers directly.
2. `domain/`, `application/`, `infrastructure/`, `presentation/` are internal to each bounded context.
3. Observability and messaging live under `apps/api/src/shared/infrastructure/`.
4. Background job handlers live under `apps/api/src/jobs/` (not a bounded-context module).

## Bounded contexts

| Module | Purpose | Status |
|--------|---------|--------|
| identity | Users, OAuth integrations | Active |
| pipeline | File processing runs | Active (legacy CRUD in `_article_legacy/`) |
| storage | Object storage (R2) | Scaffold |
| notifications | Email, webhooks | Scaffold |
| billing | Razorpay / Stripe | Scaffold |

## TypeORM

- Config: `apps/api/typeorm.config.ts`
- CLI data source: `apps/api/src/shared/infrastructure/database/data-source.ts`
- Migrations: `apps/api/src/shared/infrastructure/database/migrations/`
- Entities: `**/*.entity.ts` (future `*.orm-entity.ts`) under module folders
- `DatabaseModule` is `@Global()` — inject the `TYPEORM` token from `database.provider.ts`.

## Environment variables

- **API:** `apps/api/.env.example` (committed) → copy to `.env.development` | `.env.staging` | `.env.production` (gitignored).
- **Web:** `apps/web/.env.local` — separate from the API.
- NestJS and TypeORM CLI both read `.env.{NODE_ENV}` from **`apps/api/`**.
- Sections in `.env.example` map to bounded contexts (identity/OAuth, storage/R2, billing, jobs/Redis, etc.).

## Path aliases

| Alias | Resolves to |
|-------|------------|
| `@api/*` | `apps/api/src/*` |
| `@/` (web) | `apps/web/src/` |
