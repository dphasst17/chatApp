import { Module } from '@nestjs/common';
import { NatsClientModule } from 'src/nast-client/nast-client.module';
import { AuthController } from './auth.controller';

@Module({
    imports: [NatsClientModule],
    controllers: [AuthController],
    providers: [],
})
export class AuthModule { }
