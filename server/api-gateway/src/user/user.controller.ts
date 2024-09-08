import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('user')
export class UserController {

    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }
}
