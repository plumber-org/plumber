import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private redisClient: Redis.Redis) {}

    /**
     * Sets a key-value pair in Redis with an optional expiration time.
     * @param key - The key to set in Redis.
     * @param value - The value to store, which will be serialized to JSON.
     * @param ttlInSeconds - Optional expiration time in seconds. If not provided or <= 0, the key will persist indefinitely.
     * @returns A promise that resolves to `true` when the operation succeeds.
     */
    async setValue<T>(key: string, value: T, ttlInSeconds?: number): Promise<boolean> {
        const valueStr = JSON.stringify(value);

        if (ttlInSeconds !== undefined && ttlInSeconds > 0)
            await this.redisClient.set(key, valueStr, 'EX', ttlInSeconds);
        else await this.redisClient.set(key, valueStr);

        return true;
    }

    /**
     * Retrieves the value associated with a key in Redis.
     * @param key - The key to retrieve the value for.
     * @returns A promise that resolves to the deserialized value, or `null` if the key does not exist.
     */
    async getValue<T>(key: string): Promise<T | null> {
        const result = await this.redisClient.get(key);
        return result ? JSON.parse(result) : null;
    }

    /**
     * Retrieves the time-to-live (TTL) of a key in Redis.
     * @param key - The key to check the TTL for.
     * @returns A promise that resolves to the TTL in seconds if the key exists and has a TTL, or `null` otherwise.
     */
    async getTtl(key: string): Promise<number | string> {
        const ttl = await this.redisClient.ttl(key);
        return ttl > 0 ? ttl : null;
    }

    /**
     * Deletes a key from Redis.
     * @param key - The key to delete.
     * @returns A promise that resolves to `true` when the operation succeeds.
     */
    async deleteKey(key: string): Promise<boolean> {
        await this.redisClient.del(key);
        return true;
    }

    /**
     * Sets a field-value pair in a Redis hash with an optional expiration time.
     * @param hashKey - The Redis hash key.
     * @param field - The field within the hash to set.
     * @param value - The value to store.
     * @param ttlInSeconds - Optional expiration time in seconds for the hash. If not provided or <= 0, the hash will persist indefinitely.
     * @returns A promise that resolves to `true` if the operation succeeds, or `null` if the field could not be set.
     */
    async setHashValue(
        hashKey: string,
        field: string,
        value: any,
        ttlInSeconds?: number,
    ): Promise<boolean | null> {
        const result = await this.redisClient.hset(hashKey, field, value);
        if (result != 1) return null;

        // Only set expiration if ttlInSeconds is provided and it is a positive number
        if (ttlInSeconds !== undefined && ttlInSeconds > 0)
            await this.redisClient.expire(hashKey, ttlInSeconds);

        return true;
    }

    /**
     * Retrieves the value of a field in a Redis hash.
     * @param hashKey - The Redis hash key.
     * @param field - The field within the hash to retrieve the value for.
     * @returns A promise that resolves to the value if it exists, or `null` if it does not.
     */
    async getHashValue(hashKey: string, field: string): Promise<any> {
        const value = await this.redisClient.hget(hashKey, field);
        return value !== null ? value : null;
    }

    /**
     * Increments the value of a Redis key by one and retrieves the updated value.
     * If the key does not exist, it will be initialized to 0 before being incremented.
     *
     * @param key - The Redis key to increment.
     * @returns A promise that resolves to the new value of the key after incrementing.
     */
    async incrementAndGetValue(key: string) {
        return await this.redisClient.incr(key);
    }

    /**
     * Decrements the value of a Redis key by one and retrieves the updated value.
     * If the key does not exist, it will be initialized to 0 and then decremented to -1.
     *
     * @param key - The Redis key to decrement.
     * @returns A promise that resolves to the new value of the key after decrementing.
     */
    async decrementAndGetValue(key: string) {
        return await this.redisClient.decr(key);
    }
}
