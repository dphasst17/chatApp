import { Controller, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { ChatRequest } from 'src/chat.interface';

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

    @EventPattern({ cmd: 'get_chat_detail_info' })
    async getChatDetailInfo(idChat: string) {
        return await this.chatService.getChatDetailInfo(idChat)
    }

    @EventPattern({ cmd: 'get_chat_detail' })
    async getChatDetail(data: { idChat: string, page: number, limit: number }) {
        return await this.chatService.getChatDetail(data.idChat, data.page, data.limit)
    }

    @EventPattern({ cmd: 'get_chat_image_by_id' })
    async getChatImageById(data: { idChat: string, page: number, limit: number }) {
        return await this.chatService.getChatImageById(data.idChat, data.page, data.limit)
    }

    @EventPattern({ cmd: 'chat_update' })
    async chatUpdate(data: { id: string, idUser: string, data: any }) {
        return await this.chatService.chatUpdate(data.id, data.idUser, data.data)
    }

    @EventPattern({ cmd: 'chat_insert' })
    async chatInsert(data: ChatRequest) {
        return await this.chatService.chatInsert(data)
    }

    @EventPattern({ cmd: 'chat_images' })
    async chatImages(data: { images: string[], idChat: string, idUser: string, name: string }) {
        return await this.chatService.chatImages(data)
    }
}
