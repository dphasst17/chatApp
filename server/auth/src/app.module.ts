import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP
      }
    ]),
    NatsClientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
