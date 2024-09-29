import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log('Images Microservice is Running!');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: [`nats://${process.env.NATS_URL ? process.env.NATS_URL : 'nats'}`],
      },
    },
  );
  //check connection mongodb
  await app.listen();
}
bootstrap();
