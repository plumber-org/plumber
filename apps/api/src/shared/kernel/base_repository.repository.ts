import { Injectable } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@api/shared/constants/database';
import { IFindOneOption, IModelOption } from './base_repository.interface';

@Injectable()
export class BaseRepository<T extends ObjectLiteral> {
    constructor(protected readonly repository: Repository<T>) {}

    async exists(where: FindOptionsWhere<T>): Promise<boolean> {
        return this.repository.exists({ where });
    }

    async findOne(where: FindOptionsWhere<T>, options?: IFindOneOption<T>): Promise<T | null> {
        return this.repository.findOne({
            where,
            order: options?.order,
            select: options?.select,
            relations: options?.relations,
            ...(options?.cache !== undefined && { cache: options.cache }),
        });
    }

    async findAll(
        where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>,
        options?: IModelOption<T>,
    ): Promise<T[]> {
        return this.repository.find({
            where,
            order: options?.order,
            select: options?.select as FindManyOptions<T>['select'],
            relations: options?.relations,
            ...this.getPaginationParams(options?.page, options?.perPage),
            ...(options?.cache !== undefined && { cache: options.cache }),
        });
    }

    async findAndCountAll(
        where: FindOptionsWhere<T> = {} as FindOptionsWhere<T>,
        options?: IModelOption<T>,
    ): Promise<[T[], number]> {
        return this.repository.findAndCount({
            where,
            order: options?.order,
            select: options?.select as FindManyOptions<T>['select'],
            relations: options?.relations,
            ...this.getPaginationParams(options?.page, options?.perPage),
            ...(options?.cache !== undefined && { cache: options.cache }),
        });
    }

    async create(data: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }

    async update(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<void> {
        await this.repository.update(where, data as any);
    }

    async delete(where: FindOptionsWhere<T>): Promise<void> {
        await this.repository.delete(where);
    }

    // paranoid equivalent — sets deletedAt, row is excluded from all future queries
    async softDelete(where: FindOptionsWhere<T>): Promise<void> {
        await this.repository.softDelete(where);
    }

    // restore a soft-deleted row (clears deletedAt)
    async restore(where: FindOptionsWhere<T>): Promise<void> {
        await this.repository.restore(where);
    }

    createQueryBuilder(alias?: string) {
        return this.repository.createQueryBuilder(alias);
    }

    getPaginationParams(page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE, isPagination = true) {
        return isPagination ? { take: perPage, skip: (page - 1) * perPage } : {};
    }
}
