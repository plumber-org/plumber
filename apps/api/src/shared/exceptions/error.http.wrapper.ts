import { HttpException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { IFieldError } from './error.interface';
import { DEFAULT_ERROR, ERROR, errorConfig } from '@api/shared/constants/error';

// PostgreSQL error codes
const PG_FOREIGN_KEY_VIOLATION = '23503';
const PG_UNIQUE_VIOLATION = '23505';

export class HttpExceptionWrapper extends HttpException {
    constructor(
        error?: ERROR,
        errors?: unknown,
        logs?: {
            name?: string;
            info?: Record<string, any>;
        },
    ) {
        let resultErrors: IFieldError[] | undefined = undefined;
        let mainError: ERROR = error;

        if (errors instanceof QueryFailedError) {
            const code = (errors as any).code as string;

            if (code === PG_FOREIGN_KEY_VIOLATION) {
                const constraint: string = (errors as any).constraint ?? '';
                const table: string = (errors as any).table ?? '';
                const keyName = constraint.replace(`${table}_`, '').replace('_fkey', '');

                resultErrors = [
                    {
                        field: table,
                        error: `Foreign key constraint: ${keyName}`,
                    },
                    {
                        field: 'keyName',
                        error: `${keyName} is not a valid entry`,
                    },
                ];
                mainError = DEFAULT_ERROR.SEQUELIZE_VALIDATION;
            } else if (code === PG_UNIQUE_VIOLATION) {
                const detail: string = (errors as any).detail ?? '';
                resultErrors = [{ field: 'unique', error: detail || 'Duplicate entry' }];
                mainError = DEFAULT_ERROR.SEQUELIZE_VALIDATION;
            }
        }

        const defaultError: ERROR = mainError ?? DEFAULT_ERROR.DEFAULT;
        const errorInfo = errorConfig[defaultError];

        super({ ...errorInfo, errors: resultErrors ?? errors, logs }, errorInfo.statusCode);
    }
}

export class DefaultError extends Error {
    field: string;
    error: string;
    constructor(field: string, error: string) {
        super();
        this.name = 'DefaultError';
        this.field = field;
        this.error = error;
    }
}
