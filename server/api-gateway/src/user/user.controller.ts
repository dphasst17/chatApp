import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { ObjectCustom, RequestCustom } from 'src/interface/custom.interface';
import { FriendRequest } from 'src/interface/user.interface';
import { SocketGateway } from 'src/socket/socket.gateway';

@Controller('api/user')
export class UserController {

    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private readonly socketGateway: SocketGateway
    ) { }
    @Get('/index')
    async index() {
        return this.natsClient.send({ cmd: 'user_index' }, {});
    }
    @Get()
    async getUser(@Req() req: RequestCustom, @Res() res: Response) {
        const data = await firstValueFrom(this.natsClient.send({ cmd: 'user_get' }, req.idUser))
        if (!data) return res.status(404).json({ status: 404, message: 'User not found' })
        this.socketGateway.online(data.data.idUser)
        return res.status(data.status).json(data)
    }
    @Get('search/:key')
    async search(@Param('key') key: string) {
        return this.natsClient.send({ cmd: 'user_search' }, key);
    }
    @Patch()
    async updateUser(@Req() req: RequestCustom, @Res() res: Response, @Body() data: ObjectCustom) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'user_update' }, { idUser: req.idUser, data: data }))
        return res.status(result.status).json(result)
    }
    @Get('friend/:status')
    async friendGetByStatus(@Req() req: RequestCustom, @Res() res: Response, @Param('status') status: string) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'friend_status' }, { idUser: req.idUser, status }))
        return res.status(result.status).json(result)
    }
    @Post('friend')
    async addFriend(@Body() data: FriendRequest, @Req() req: RequestCustom, @Res() res: Response) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'friend_add' }, { idUser: req.idUser, ...data.data }))
        this.socketGateway.emitData('s_g_r_friend', { ...result.data, friend: { ...data.info, idUser: req.idUser } })
        return res.status(result.status).json(result)
    }
    @Patch('friend')
    async friendUpdate(@Body() data: { [key: string]: string | Date | number }, @Res() res: Response) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'friend_update' }, data))
        return res.status(result.status).json(result)
    }
    @Delete('friend/:id')
    async friendRemove(@Param('id') id: string, @Res() res: Response) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'friend_remove' }, id))
        return res.status(result.status).json(result)
    }
}
