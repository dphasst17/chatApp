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
    emitData(url: string, data: any) {
        this.socket.emit(url, data)
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
    @SubscribeMessage('video_call')
    async handleVideoCall(client: Socket, data: { idChat: string, link: string }) {
        this.socket.emit('s_g_r_vd_on', data);
    }
    @SubscribeMessage('reaction')
    handleReaction(client: Socket, data: any) {
        this.socket.emit('s_g_r_reaction', data);
    }
    @SubscribeMessage('chat_info')
    handleChangeChatInfo(client: Socket, data: any) {
        this.socket.emit('s_g_r_chat_info', data);
    }
    @SubscribeMessage('notification')
    handleNotification(client: Socket, data: { idChat: string, detail: any }) {
        this.socket.emit('s_g_r_notification', data);
    }
    @SubscribeMessage('s_g_r_checked')
    checkSocket() {
        return "Connected is done"
    }

}
