import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
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
    @Get('search/:key')
    async search(@Param('key') key: string) {
        return this.natsClient.send({ cmd: 'user_search' }, key);
    }
    @Patch()
    async updateUser(@Req() req: RequestCustom, @Body() data: ObjectCustom) {
        return this.natsClient.send({ cmd: 'user_update' }, { idUser: req.idUser, data });
    }
    @Get('friend/:status')
    async friendGetByStatus(@Req() req: RequestCustom, @Param('status') status: string) {
        return this.natsClient.send({ cmd: 'friend_status' }, { idUser: req.idUser, status })
    }
    @Post('friend')
    async addFriend(@Body() data: { idFriend: string, status: string, created_at: Date, updated_at: Date }, @Req() req: RequestCustom) {
        return this.natsClient.send({ cmd: 'friend_add' }, { idUser: req.idUser, ...data })
    }
    @Patch('friend')
    async friendUpdate(@Body() data: { [key: string]: string | Date | number }) {
        return this.natsClient.send({ cmd: 'friend_update' }, data)
    }
    @Delete('friend/:id')
    async friendRemove(@Param('id') id: string) {
        return this.natsClient.send({ cmd: 'friend_remove' }, id)
    }
}
