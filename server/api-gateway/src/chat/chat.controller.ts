import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('chat')
export class ChatController {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }
}
