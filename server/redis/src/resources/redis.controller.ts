import { Controller } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventPattern } from '@nestjs/microservices';
@Controller()
export class RedisController {
    constructor(
        private readonly redisService: RedisService,
    ) { }
    @EventPattern('redis')
    async redis() {
        return "Null"
    }
    @EventPattern({ cmd: 'redis_get' })
    async redisGet(data: { key: string }) {
        return await this.redisService.redisGet(data.key)
    }
    @EventPattern({ cmd: 'redis_set' })
    async redisSet(data: { key: string, value: any }) {
        return await this.redisService.redisSet(data.key, JSON.stringify(data.value))
    }
    @EventPattern({ cmd: 'redis_update' })
    async redisUpdate(data: { key: string, value: any }) {
        return await this.redisService.redisUpdate(data.key, data.value)
    }
    @EventPattern({ cmd: 'redis_del' })
    async redisDel(data: { key: string }) {
        return await this.redisService.redisDel(data.key)
    }
}
