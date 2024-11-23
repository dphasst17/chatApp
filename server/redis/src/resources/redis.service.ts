import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
    private redis: Redis
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'redis',
            port: 6379,
        })
    }

    async redisGet(key: string) {
        const data = await this.redis.get(key)
        return JSON.parse(data)
    }

    async redisSet(key: string, value: string) {
        return await this.redis.set(key, value)
    }
    async redisUpdate(key: string, value: { [key: string]: string }) {
        const findData = await this.redisGet(key)
        const mergeData = findData ? { ...findData, ...value } : value
        return await this.redisSet(key, JSON.stringify(mergeData))
    }
    async redisDel(key: string) {
        return await this.redis.del(key)
    }

}
