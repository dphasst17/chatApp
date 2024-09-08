import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('NATS_SERVICE') private natsClient: ClientProxy,
  ) { }
  index() {
    return "Auth service is up and running!";
  }
}
