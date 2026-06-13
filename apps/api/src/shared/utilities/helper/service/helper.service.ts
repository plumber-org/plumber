import { Injectable } from '@nestjs/common';
import {
    ISortKey,
    SORT_ORDER,
    ISortPatternsKeys,
} from '../../custom-class-validator/interface/sort.interface';

@Injectable()
export class HelperService {
    constructor() {}

    sortNested<T extends Record<string, any>>(
        arr: T[],
        value: ISortPatternsKeys<ISortKey<T>> = [],
    ) {
        arr.sort((a, b) => this.sortNestedHelper(a, b, value));
    }

    sortNestedHelper<T extends Record<string, any>>(
        a: T,
        b: T,
        value: ISortPatternsKeys<ISortKey<T>>,
        i = 0,
    ): number {
        if (i == value.length) return 1;

        const valueArray = (value[i] as string).split(':');
        const valueKey = valueArray[0] as any;
        const valueOrder = valueArray?.[1] ?? SORT_ORDER.ASC;

        const currValueA = a[valueKey];
        const currValueB = b[valueKey];

        if (currValueA === currValueB) return this.sortNestedHelper(a, b, value, i + 1);

        const comparison =
            typeof currValueA === 'string' && typeof currValueB === 'string'
                ? currValueA.localeCompare(currValueB)
                : (currValueA as number) - (currValueB as number);

        return valueOrder === SORT_ORDER.ASC ? comparison : -comparison;
    }

    async mapAsyncParallel<T, R>(tasks: T[], taskFn: (task: T) => Promise<R>): Promise<R[]> {
        return Promise.all(tasks.map((task) => taskFn(task)));
    }

    async mapAsyncSequential<T, R>(tasks: T[], taskFn: (task: T) => Promise<R>): Promise<R[]> {
        const results: R[] = [];
        for (const task of tasks) {
            try {
                const result = await taskFn(task);
                results.push(result);
            } catch (error) {
                throw new Error(`Failed to process task ${task}`);
            }
        }
        return results;
    }

    pauseExecution(seconds: number): void {
        const endTime = Date.now() + seconds * 1000;
        while (Date.now() < endTime) {
            // Busy wait (blocks the thread)
        }
    }

    changeDateFormat(dateString: Date): string {
        if (dateString == null) {
            return '-';
        }
        const date = new Date(dateString);

        const formattedDate = date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });

        const finalFormattedDate = formattedDate.replace(',', '').replace(/\//g, '-');

        return finalFormattedDate;
    }
}
