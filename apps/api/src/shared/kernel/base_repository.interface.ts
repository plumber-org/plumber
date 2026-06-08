import { FindManyOptions, FindOneOptions, ObjectLiteral } from 'typeorm';

export type CacheOption = boolean | number | { id: string; milliseconds: number };

export type IModelOption<T extends ObjectLiteral = ObjectLiteral> = {
    page?: number;
    perPage?: number;
    order?: FindManyOptions<T>['order'];
    select?: FindManyOptions<T>['select'];
    relations?: FindManyOptions<T>['relations'];
    /** TypeORM query cache. Pass true (default TTL), ms number, or { id, milliseconds }. */
    cache?: CacheOption;
};

export type IFindOneOption<T extends ObjectLiteral = ObjectLiteral> = {
    order?: FindOneOptions<T>['order'];
    select?: FindOneOptions<T>['select'];
    relations?: FindOneOptions<T>['relations'];
    cache?: CacheOption;
};
