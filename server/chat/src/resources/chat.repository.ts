import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChatInfoRequest, ChatRequest } from "src/chat.interface";
import { Chat, ChatImage, ChatInfo } from "src/chat.schema";

export class ChatRepository {
    constructor(
        @InjectModel('chat') private readonly chat: Model<Chat>,
        @InjectModel('chat-info') private readonly chatInfo: Model<ChatInfo>,
        @InjectModel('chat-image') private readonly chatImage: Model<ChatImage>,
    ) { }
    async chatChecked() {
        return "Chat service is up and running!";
    }
    async createChat(data: ChatInfoRequest) {
        const getChatInfo = await this.chatInfo.find({ user: data.user }).exec();
        if (getChatInfo.length > 0) {
            return getChatInfo
        }
        const chatInfo = await this.chatInfo.create(data);
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
                    foreignField: 'idChat',
                    as: 'lastMessage'
                }
            },
            {
                $addFields: {
                    lastMessage: { $ifNull: [{ $arrayElemAt: ['$lastMessage', -1] }, null] }
                }
            }
        ]);
        return data;
    }
    async getCountChatDetail(idChat: string) {
        const data = await this.chat.aggregate([
            { $match: { idChat: idChat } },
            { $count: "count" }
        ])
        return data
    }
    async getChatDetail(id: string, page: number, limit: number) {
        const getData = await this.chat.find({ idChat: id }).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
        return getData.reverse()
    }


    async chatUpdate(id: string, data: { [key: string]: string | number | boolean | [] | {} }) {
        return this.chat.findByIdAndUpdate({ _id: id }, data)
    }

    async chatImages(data: ChatImage[]) {
        const insert = await this.chatImage.insertMany(data)
        return insert
    }
}