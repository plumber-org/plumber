# Architecture

Modular monolith monorepo for the file processing pipeline.

## Layout

- `apps/api` — NestJS API (bounded contexts under `src/modules/`)
- `apps/web` — Next.js (scaffold)
- `packages/contracts` — shared API types for web/clients
- `packages/types`, `packages/utils` — shared pure TS
- `infrastructure/` — Docker, nginx, Terraform, k8s (ops only)

## Module rules

1. Other modules may import only from `modules/<name>/public/`.
2. `domain/`, `application/`, `infrastructure/`, `presentation/` are internal.
3. Observability and messaging live under `apps/api/src/shared/infrastructure/`.
4. Background job handlers live under `apps/api/src/jobs/` (not a bounded-context module).

## Bounded contexts (scaffolded)

| Module | Purpose |
|--------|---------|
| identity | Users, OAuth integrations |
| pipeline | File processing runs |
| storage | Object storage (R2) |
| notifications | Email, webhooks |
| billing | Razorpay, Stripe |

Legacy article CRUD remains under `modules/pipeline/_article_legacy/` until migrated into pipeline layers.

## Environment variables

- **API:** `apps/api/.env.example` (committed) → copy to `.env.development` | `.env.staging` | `.env.production` (gitignored).
- **Web (later):** `apps/web/.env*` — separate from the API.
- Nest and TypeORM CLI both read `.env.{NODE_ENV}` from **`apps/api/`**.
- Sections in `.env.example` map to bounded contexts (identity/OAuth, storage/R2, billing, jobs/Redis, etc.).
