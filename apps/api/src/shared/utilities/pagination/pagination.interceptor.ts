import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { PaginationService } from './pagination.service';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request } from 'express';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
    constructor(private paginationService: PaginationService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        if (context.getType() === 'http') {
            return next.handle().pipe(
                map(async (responseData: Promise<Record<string, any>>) => {
                    const { count, statusCode, message, ...data } = await responseData;

                    const ctx: HttpArgumentsHost = context.switchToHttp();
                    const request: Request = ctx.getRequest();

                    return {
                        statusCode,
                        message,
                        data: data.data ?? data.rows ?? data,
                        metadata: this.paginationService.getPaginationMetadata(request, count),
                    };
                }),
            );
        }

        return next.handle();
    }
}
