import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthSchema } from 'src/auth.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'auth', schema: AuthSchema }]),
        ClientsModule.register([
            {
                name: 'AUTH_SERVICE',
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
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
})
export class AuthModule { }
