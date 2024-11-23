import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
@Module({
    imports: [
        NatsClientModule,
    ],
    controllers: [RedisController],
    providers: [RedisService],
})
export class AuthModule { }
