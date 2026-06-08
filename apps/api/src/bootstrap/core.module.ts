import { Module } from '@nestjs/common';
import ConfigModule from './config.module';
import { ErrorModule } from '@api/shared/exceptions/error.module';
import { WinstonModule } from 'nest-winston';
import { DebuggerModule } from '@api/shared/infrastructure/observability/debugger.module';
import { DatabaseModule } from '@api/shared/infrastructure/database/database.module';
import { PaginationModule } from '@api/shared/utilities/pagination/pagination.module';
import { ServiceGatewayModule } from '@api/shared/infrastructure/service-gateway/service_gateway.module';
import { RedisModule } from '@api/shared/infrastructure/cache/redis/redis.module';
import { MessagingModule } from '@api/shared/infrastructure/messaging/messaging.module';
import { DebuggerService } from '@api/shared/infrastructure/observability/service/debugger.service';

@Module({
    imports: [
        // Config setup for environment file and values
        ConfigModule,

        // Winston setup for logging
        WinstonModule.forRootAsync({
            inject: [DebuggerService],
            imports: [DebuggerModule],
            useFactory: (debuggerService: DebuggerService) => debuggerService.createLogger(),
        }),

        // Error Module
        ErrorModule,

        // Database Modules
        DatabaseModule,

        // Pagination Modules
        PaginationModule,

        // ServiceGateway Module
        ServiceGatewayModule,

        // Redis Module
        RedisModule,

        // Messaging (Bull / events) — stub until scale demands more
        MessagingModule,
    ],
})
export class CoreModule {}
