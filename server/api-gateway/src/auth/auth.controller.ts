import { Controller, Inject, Post, Body, Get, Put, Req, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginRequest } from '../interface/auth.interface';
import { RequestCustom } from 'src/interface/custom.interface';

@Controller('api/auth')
export class AuthController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

    @Get('index')
    authChecked() {
        return this.natsClient.send({ cmd: 'auth_checked' }, {});
    }

    @Post('login')
    authLogin(@Body() data: AuthLoginRequest) {
        return this.natsClient.send({ cmd: 'login' }, data);
    }

    @Post('register')
    authRegister(@Body() data: AuthLoginRequest) {
        return this.natsClient.send({ cmd: 'register' }, data);
    }
    @Put('token')
    token(@Req() req: RequestCustom) {
        const id = req.idUser
        return this.natsClient.send({ cmd: 'token' }, id);
    }
    @Patch('password')
    password(@Req() req: RequestCustom, @Body() data: { current: string, password: string }) {
        const id = req.idUser
        return this.natsClient.send({ cmd: 'password' }, { id, data });
    }
}