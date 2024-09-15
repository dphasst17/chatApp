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
        return firstValueFrom(this.natsClient.send({ cmd: 'user_get_info' }, { idUser })).then((result: any) => result[value])
    }
    async chatChecked() {
        return this.chatRepository.chatChecked();
    }

    async createChat(data: any) {
        return this.chatRepository.createChat(data)
    }

    async getChatByUser(idUser: string) {
        const data = await this.chatRepository.getChatByUser(idUser)
        const result = data.map((item: any) => ({
            ...item,
            name: item.type === "group" ? item.name : this.getUserInfo(item.user.filter((item: any) => item !== idUser)[0], "name"),
            avatar: item.type === "group" ? item.avatar : this.getUserInfo(item.user.filter((item: any) => item !== idUser)[0], "avatar"),
        }))

        return result
    }
    /* async getChatDetail(idChat: string) {
        return this.chatRepository.getChatDetail(idChat)
    } */
}
