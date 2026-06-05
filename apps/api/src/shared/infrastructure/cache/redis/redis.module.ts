import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './service/redis.service';
import * as Redis from 'ioredis';

@Module({
    imports: [],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const redisConfig = configService.get('redis');
                return new Redis.Redis({
                    host: redisConfig.host,
                    port: redisConfig.port,
                    ...(redisConfig.username && { username: redisConfig.username }),
                    ...(redisConfig.password && { password: redisConfig.password }),
                    ...(redisConfig.tls && { tls: {} }),
                });
            },
        },
        RedisService,
    ],
    exports: [RedisService],
})
export class RedisModule {}
