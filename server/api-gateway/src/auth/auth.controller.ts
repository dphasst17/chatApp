import { Controller, Inject, Post, Body, Get, Put, Req, Patch, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginRequest } from '../interface/auth.interface';
import { RequestCustom } from 'src/interface/custom.interface';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('api/auth')
export class AuthController {
    constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

    @Get('index')
    authChecked(@Res() res: Response) {
        const data = this.natsClient.send({ cmd: 'auth_checked' }, {});
        return res.status(200).json(data)
    }

    @Post('login')
    async authLogin(@Body() data: AuthLoginRequest, @Res() res: Response) {
        const result: any = await firstValueFrom(this.natsClient.send({ cmd: 'login' }, data))
        return res.status(result.status).json(result)
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