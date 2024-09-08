import { Controller, Inject, Post, Body, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

    @Get()
    authChecked() {
        return this.natsClient.send({ cmd: 'auth_checked' }, {});
    }
}