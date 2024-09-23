import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { NatsClientModule } from 'src/nast-client/nast-client.module';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [NatsClientModule],
  controllers: [ChatController],
  providers: [SocketGateway],
})
export class ChatModule { }
