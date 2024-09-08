import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NatsClientModule } from 'src/nast-client/nast-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule { }
