import { Body, Controller, Get, Inject, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { RequestCustom } from 'src/interface/custom.interface';
import { SocketGateway } from 'src/socket/socket.gateway';

@Controller('api/chat')
export class ChatController {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private readonly socketGateway: SocketGateway
    ) { }

    @Get('checked')
    async chatChecked(@Res() res: Response) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'chat_checked' }, {}))
        return res.status(200).json({
            status: 200,
            message: result
        })
    }
    @Get('')
    async getChatByUser(@Req() req: RequestCustom, @Res() res: Response) {
        const idUser = req.idUser
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'get_chat_by_user' }, idUser))
        return res.status(result.status).json(result)
    }

    @Get(':id')
    async getChatDetail(@Param('id') idChat: string, @Res() res: Response) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'get_chat_detail' }, idChat))
        return res.status(result.status).json(result)
    }
    @Post('')
    async chatCreate(@Res() res: Response, @Req() req: RequestCustom, @Body() data: { [key: string]: string | number | boolean | [] | {} | any }) {
        const create = await firstValueFrom(this.natsClient.send({ cmd: 'create_chat' }, { ...data, user: [req.idUser, ...data.user] }))
        return res.status(create.status).json(create)
    }
    @Post(':id')
    async chatInsert(@Param('id') idChat: string, @Res() res: Response, @Req() req: RequestCustom, @Body() data: { [key: string]: string | number | boolean | [] | {} | any }) {
        const insert = await firstValueFrom(this.natsClient.send({ cmd: 'chat_insert' }, { ...data, sender: req.idUser, idChat }))
        this.socketGateway.emitData('s_g_r_chat', { ...insert.data, idChat })
        return res.status(insert.status).json(insert)
    }
    @Patch(':id')
    async chatUpdate(@Param('id') idChat: string, @Res() res: Response, @Body() data: { [key: string]: string | number | boolean | [] | {} | any }) {
        const update = await firstValueFrom(this.natsClient.send({ cmd: 'chat_update' }, { ...data, _id: idChat }))
        return res.status(update.status).json(update)
    }
}
