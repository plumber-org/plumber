import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseService } from './database.service';

export const TYPEORM = 'TYPEORM';

export const databaseProvider = {
    provide: TYPEORM,
    inject: [ConfigService, WINSTON_MODULE_PROVIDER, DatabaseService],
    useFactory: async (
        configService: ConfigService,
        logger: Logger,
        databaseService: DatabaseService,
    ) => {
        const postgresConfig = configService.get('database.postgres');
        const dataSource = new DataSource(
            postgresConfig
        );

        await dataSource.initialize();

        logger.info('Database connected successfully', {
            database: configService.get('database.postgres.database'),
            host: configService.get('database.postgres.host'),
            port: configService.get('database.postgres.port'),
        });

        await databaseService.seedingData(dataSource);

        return dataSource;
    },
};
