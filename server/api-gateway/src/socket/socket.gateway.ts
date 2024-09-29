import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    methos: ['GET', 'POST'],

})
export class SocketGateway {
    @WebSocketServer()
    socket: Server
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }
    online(idUser: string) {
        this.socket.emit('s_g_r_online', idUser)
    }
    @SubscribeMessage('u_create_group')
    async createGroup(client: Socket, data: any) {
        try {
            this.socket.emit('s_g_r_create_group', data);
        } catch (error) {
            console.error('Error handling create group:', error);
        }
    }
    @SubscribeMessage('u_disconnect')
    async disconnect(client: Socket, idUser: string) {

        try {
            const update = await firstValueFrom(this.natsClient.send({ cmd: 'user_update' }, { idUser: idUser, data: { online: false } }))
            if (update.status !== 200) return
            this.socket.emit('s_g_r_offline', idUser);
            return "Disconnect is done";
        } catch (error) {
            console.error('Error handling disconnect:', error);
        }
    }
    @SubscribeMessage('reaction')
    handleReaction(client: Socket, data: any) {
        this.socket.emit('s_g_r_reaction', data);
    }
    emitData(url: string, data: any) {
        this.socket.emit(url, data)
    }
    @SubscribeMessage('s_g_r_checked')
    checkSocket() {
        return "Connected is done"
    }

}
