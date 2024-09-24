import { Inject, Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ChatRequest } from 'src/chat.interface';
import { ChatImage } from 'src/chat.schema';

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

    async chatInsert(data: ChatRequest) {
        const result = await this.chatRepository.chatInsert(data)
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
        const count = await this.chatRepository.getCountChatDetail(idChat)
        const result = await this.chatRepository.getChatDetail(idChat, page, limit)
        return {
            status: 200, data: {
                total: count[0].count,
                data: result
            }
        }
    }
    async chatUpdate(id: string, data: any) {
        const update = await this.chatRepository.chatUpdate(id, data)
        return { status: 200, message: "Update chat is success" }
    }

    async chatImages(data: { images: string[], idChat: string, idUser: string, name: string, }) {
        const convertData = data.images.map((item: any) => {
            return {
                image: item,
                idChat: data.idChat,
                idUser: data.idUser,
                name: data.name,
                date: new Date()
            }
        })
        console.log("start")
        const insert = await this.chatRepository.chatImages(convertData)
        return { status: 201, data: insert }
    }
}
