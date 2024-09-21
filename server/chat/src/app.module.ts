import { Module } from '@nestjs/common';
import { NatsClientModule } from './nats-client/nats-client.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './resources/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.NAME}:${process.env.PASS}@tech.of4l8iy.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority&ssl=true`),
    NatsClientModule,
    ChatModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
