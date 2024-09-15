import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatInfoSchema, ChatSchema } from 'src/chat.schema';
import { ChatRepository } from './chat.repository';

@Module({
  providers: [ChatService, ChatRepository],
  controllers: [ChatController],
  imports: [
    MongooseModule.forFeature([{ name: 'chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'chat-info', schema: ChatInfoSchema }]),
    MongooseModule.forFeature([{ name: 'chat-image', schema: ChatInfoSchema }]),
  ],
})
export class ChatModule { }
