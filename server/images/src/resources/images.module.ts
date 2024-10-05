import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IMAGES_SERVICE',
        transport: Transport.NATS,
      }
    ]),
    NatsClientModule,
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {
}