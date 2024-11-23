import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [process.env.NATS_URL],
      },
    },
  );
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: 6379,
  });
  redis.ping((err, result) => {
    if (err) {
      console.error('Failed to connect to Redis:', err);
    } else {
      console.log('Connected to Redis:', result);
    }
    redis.quit();
  });
  console.log('Redis Microservice is Running!');
  await app.listen();
}
bootstrap();