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
                    const id = item.user.filter((u: string) => u !== idUser)[0];
                    const name = id && await this.getUserInfo(id, 'name');
                    const avatar = id && await this.getUserInfo(id, 'avatar');
                    return {
                        ...item,
                        lastMessage: item.lastMessage
                            ? (item.lastMessage.message.includes('<p') ? item.lastMessage.message : 'Images')
                            : (item.type === "group" ? `<p class="text-zinc-300">${item.notification}</p>` : '<p class="text-zinc-300">No message</p>'),
                        name: item.name ? item.name : name,
                        avatar: item.avatar ? item.avatar : avatar
                    };
                })
            );
            return { status: 200, data: result }
        }
        catch (error) {
            return { status: 500, message: error }
        }
    }
    async getChatDetailInfo(idChat: string) {
        try {
            const data = await this.chatRepository.getChatDetailInfo(idChat)
            const result = {
                _id: data._id,
                name: data.name,
                avatar: data.avatar,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                time: data.time,
                type: data.type,
                notification: data.notification,
                user: data.type === "group" ? data.user : await Promise.all(
                    data.user.map(async (idUser: string) => {
                        const name = await this.getUserInfo(idUser, 'name');
                        const avatar = await this.getUserInfo(idUser, 'avatar');
                        return {
                            idUser: idUser,
                            name: name,
                            avatar: avatar
                        }
                    })
                )
            }
            return { status: 200, data: result }
        }
        catch (error) {
            return { status: 500, message: error }
        }
    }
    async getChatDetail(idChat: string, page: number, limit: number) {
        const count = await this.chatRepository.getCountChatDetail(idChat, "chat")
        const result = await this.chatRepository.getChatDetail(idChat, page, limit)
        return {
            status: 200, data: {
                total: count ? count[0]?.count : 0,
                data: result ? result : []
            }
        }
    }
    async getChatImageById(idChat: string, page: number, limit: number) {
        const count = await this.chatRepository.getCountChatDetail(idChat, "image")
        const result = await this.chatRepository.getChatImageById(idChat, page, limit)
        return {
            status: 200, data: {
                total: count ? count[0]?.count : 0,
                data: result
            }
        }

    }

    /* 
        body data for reaction message:
        {
            type?: string
            detail?: this is old array emoji [
                {
                    emoji?: string
                    idUser?: string
                },...
            ]
            emoji?: string
        }
    */
    async chatUpdate(id: string, idUser: string, data: any) {
        const convertData = data.type === "chat" && [
            ...data.detail,
            {
                emoji: data.emoji,
                idUser: idUser
            }
        ]
        const query = data.type === "chat" ? this.chatRepository.chatUpdate(id, { emoji: convertData }) : this.chatRepository.chatInfoUpdate(id, data)
        const update = await query
        if (!update) {
            return {
                status: 400,
                message: "Update chat is failed"
            }
        }
        return { status: 200, message: "Update chat is success", data: data.type === "chat" ? convertData : update }
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
        const insert = await this.chatRepository.chatImages(convertData)
        return { status: 201, data: insert }
    }
}
