import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NatsClientModule } from 'src/nast-client/nast-client.module';
import { SocketGateway } from 'src/socket/socket.gateway';

@Module({
  imports: [NatsClientModule],
  controllers: [UserController],
  providers: [SocketGateway],
})
export class UserModule { }
