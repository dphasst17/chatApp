import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { NatsClientModule } from 'src/nast-client/nast-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [ChatController],
  providers: [],
})
export class ChatModule { }
