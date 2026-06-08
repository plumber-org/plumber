/**
 * TypeORM structural configuration for apps/api.
 * Imported by data-source.ts (CLI) and database.provider.ts (runtime).
 */

import { join } from 'path';

function isCompiledOutput(): boolean {
    return __dirname.includes('/dist/') || __dirname.includes('\\dist\\');
}

function getApiRoot(): string {
    return join(__dirname, '..', '..', '..', '..');
}

const apiRoot = getApiRoot();
const sourceRoot = isCompiledOutput() ? join(apiRoot, 'dist') : join(apiRoot, 'src');

export const ENTITY_PATTERNS = [
    join(sourceRoot, '**/*.entity{.ts,.js}'),
    join(sourceRoot, 'modules/**/infrastructure/persistence/typeorm/*.orm-entity{.ts,.js}'),
];

export const MIGRATION_PATTERNS = [
    join(sourceRoot, 'shared/infrastructure/database/migrations/*{.ts,.js}'),
    join(sourceRoot, 'modules/**/infrastructure/persistence/typeorm/migrations/*{.ts,.js}'),
];

export const MIGRATIONS_TABLE_NAME = 'typeorm_migrations';
