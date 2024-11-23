import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [`nats://${process.env.NATS_URL ? process.env.NATS_URL : 'nats'}`],
      },
    },
  );
  setTimeout(() => {
    console.log(mongoose.connection.readyState === 0 ? 'Mongoose is connected' : 'Mongoose is not connected');
  }, 1000)
  console.log('User Microservice is Running!');
  await app.listen();
}
bootstrap();