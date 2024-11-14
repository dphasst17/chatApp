import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatImageSchema, ChatInfoSchema, ChatSchema, NotificationSchema } from 'src/chat.schema';
import { ChatRepository } from './chat.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  providers: [ChatService, ChatRepository],
  controllers: [ChatController],
  imports: [
    MongooseModule.forFeature([{ name: 'chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'chat-info', schema: ChatInfoSchema }]),
    MongooseModule.forFeature([{ name: 'chat-image', schema: ChatImageSchema }]),
    MongooseModule.forFeature([{ name: 'notification', schema: NotificationSchema }]),
    ClientsModule.register([
      {
        name: 'CHAT_SERVICE',
        transport: Transport.NATS,
      }
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.NATS,
      }
    ]),
    NatsClientModule,
  ],
})
export class ChatModule { }
