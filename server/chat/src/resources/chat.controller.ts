import { Controller, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller('chat')
export class ChatController {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private readonly chatService: ChatService
    ) { }
    @EventPattern({ cmd: 'chat_checked' })
    async chatChecked() {
        return "Chat service is up and running!";
    }

    @EventPattern({ cmd: 'create_chat' })
    async createChat(data: any) {
        return await this.chatService.createChat(data)
    }

    @EventPattern({ cmd: 'get_chat_by_user' })
    async getChatByUser(idUser: string) {
        const result = await this.chatService.getChatByUser(idUser)
        return result
    }

    @EventPattern({ cmd: 'get_chat_detail' })
    async getChatDetail(idChat: string, page: number, limit: number) {
        return await this.chatService.getChatDetail(idChat, page, limit)
    }

    @EventPattern({ cmd: 'chat_update' })
    async chatUpdate(id: string, data: any) {
        return await this.chatService.chatUpdate(id, data)
    }
    @EventPattern({ cmd: 'chat_insert' })
    async chatInsert(data: any) {
        return await this.chatService.chatInsert(data)
    }
}
