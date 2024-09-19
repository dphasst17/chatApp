import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
    cors: {
        origin: '*',
    },
    methos: ['GET', 'POST'],

})
export class SocketGateway {
    @WebSocketServer()
    socket: Server
    constructor() { }
    online(idUser: string) {
        this.socket.emit('s_g_r_online', idUser)
    }
    offline(idUser: string) {
        this.socket.emit('s_g_r_offline', idUser)
    }
    emitData(url: string, data: any) {
        this.socket.emit(url, data)
    }
    @SubscribeMessage('s_g_r_checked')
    checkSocket() {
        return "Connected is done"
    }
}
