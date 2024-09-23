import { Module } from '@nestjs/common';
import { NatsClientModule } from './nats-client/nats-client.module';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './resources/images.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NatsClientModule,
    ImagesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
