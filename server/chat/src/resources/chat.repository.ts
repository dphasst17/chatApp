import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatInfoRequest, ChatRequest } from "src/chat.interface";
import { Chat } from "src/chat.schema";

export class ChatRepository {
    constructor(
        @InjectModel('chat') private readonly chat: Model<Chat>,
        @InjectModel('chat-info') private readonly chatInfo: Model<Chat>,
        @InjectModel('chat-image') private readonly chatImage: Model<Chat>,
    ) { }
    async chatChecked() {
        return "Chat service is up and running!";
    }
    async createChat(data: ChatInfoRequest) {
        const chatInfo = this.chatInfo.create(data);
        return chatInfo;
    }
    async chatInsert(data: ChatRequest) {
        const chat = this.chat.create(data);
        return chat
    }
    async getChatByUser(idUser: string) {
        const data = await this.chatInfo.aggregate([
            { $match: { user: { $in: [idUser] } } },
            { $sort: { created_at: -1 } },
            {
                $lookup: {
                    from: 'chat',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'lastMessage'
                }
            },
            {
                $addFields: {
                    lastMessage: { $arrayElemAt: ['$lastMessage', 0] }
                }
            }
        ]);
        return data
    }

    async getChatDetail(idChat: string, page: number, limit: number) {
        const getData = await this.chatInfo.find({ _id: idChat }).skip(page * limit).limit(limit)
        return getData
    }

}