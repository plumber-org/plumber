import { Entity, EntityOptions } from 'typeorm';

/**
 * Custom wrapper for TypeORM @Entity decorator.
 * Converts camelCase name to snake_case table name.
 * @param name Entity name (will be snake_cased for the table)
 * @param options Additional TypeORM EntityOptions
 */
export function CustomTable(name: string, options?: Omit<EntityOptions, 'name'>): ClassDecorator {
    return function (target: any) {
        Entity({ name: camelCaseToUnderscore(name), ...options })(target);
    };
}

function camelCaseToUnderscore(input: string) {
    return input.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
