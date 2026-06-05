import { RedisOptions } from "ioredis";

export default () => ({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    username: process.env.REDIS_USERNAME || '',
    tls: process.env.REDIS_TLS === 'true',
});

export function buildRedisOptions(): RedisOptions {
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME || '',
        password: process.env.REDIS_PASSWORD || '',
        tls: process.env.REDIS_TLS === 'true' ? { rejectUnauthorized: false } : undefined,
    };
}