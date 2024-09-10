import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from 'src/user.schema';
import { UserRepository } from './user.repository';
import { FriendSchema } from 'src/userFriend.schema';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
        MongooseModule.forFeature([{ name: 'friend', schema: FriendSchema }]),
        ClientsModule.register([
            {
                name: 'USER_SERVICE',
                transport: Transport.NATS,
            }
        ]),
        NatsClientModule,
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository],
})
export class UserModule { }
