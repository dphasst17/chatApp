import { Body, Controller, Get, Inject, Patch, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectCustom, RequestCustom } from 'src/interface/custom.interface';

@Controller('api/user')
export class UserController {

    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }
    @Get('/index')
    async index() {
        return this.natsClient.send({ cmd: 'user_index' }, {});
    }
    @Get()
    async getUser(@Req() req: RequestCustom) {
        return this.natsClient.send({ cmd: 'user_get' }, req.idUser);
    }
    @Patch()
    async updateUser(@Req() req: RequestCustom, @Body() data: ObjectCustom) {
        return this.natsClient.send({ cmd: 'user_update' }, { idUser: req.idUser, data });
    }
}
