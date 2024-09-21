import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private readonly chatRepository: ChatRepository
    ) { }
    private getUserInfo = async (idUser: string, value: any) => {
        try {
            const result = await firstValueFrom(this.natsClient.send({ cmd: 'user_get_info' }, { idUser, rValue: value }))
            return result
        }
        catch (error) {
            return error
        }
    }
    async chatChecked() {
        return this.chatRepository.chatChecked();
    }

    async createChat(data: any) {
        const _id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

        const result = await this.chatRepository.createChat({
            ...data,
            _id: _id
        })
        return { status: 201, data: result }
    }

    async getChatByUser(idUser: string) {
        try {
            const data = await this.chatRepository.getChatByUser(idUser)
            const result = await Promise.all(
                data.map(async (item: any) => {
                    const name = await this.getUserInfo(item.user[0], 'name');
                    const avatar = await this.getUserInfo(item.user[0], 'avatar');
                    return {
                        ...item,
                        name: name,
                        avatar: avatar
                    };
                })
            );

            return { status: 200, data: result }
        }
        catch (error) {
            return { status: 500, message: error }
        }
    }
    async getChatDetail(idChat: string, page: number, limit: number) {
        const result = await this.chatRepository.getChatDetail(idChat, page, limit)

        return { status: 200, data: result }
    }
    async chatUpdate(id: string, data: any) {
        const update = await this.chatRepository.chatUpdate(id, data)
        return { status: 200, message: "Update chat is success" }
    }
}
