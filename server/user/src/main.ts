import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import mongoose from 'mongoose';

async function bootstrap() {
  console.log('User Microservice is Running!');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: ['nats://nats'],
      },
    },
  );
  //check connection mongodb
  setTimeout(() => { console.log(mongoose.connection.readyState); }, 5000)
  await app.listen();
}
bootstrap();