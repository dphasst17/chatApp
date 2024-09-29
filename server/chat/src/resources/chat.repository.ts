import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { skip } from "node:test";
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
            return getChatInfo[0]
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
            },
            // Thêm một trường mới "sortField" để sử dụng trong $sort
            {
                $addFields: {
                    sortField: {
                        $cond: {
                            if: { $eq: ['$lastMessage', null] }, // Nếu lastMessage là null
                            then: '$created_at', // Lấy created_at của chính đối tượng chatInfo
                            else: '$lastMessage.date'  // Ngày từ lastMessage
                        }
                    }
                }
            },
            // Sắp xếp theo sortField
            { $sort: { sortField: -1, _id: -1 } } // Sort theo created_at giảm dần
        ]);
        return data;
    }
    async getCountChatDetail(idChat: string, type: "chat" | "image") {
        const data = await (type === "chat" ? this.chat : this.chatImage).aggregate([
            { $match: { idChat: idChat } },
            { $count: "count" }
        ])
        return data
    }
    async getChatDetail(id: string, page: number, limit: number) {
        const getData = await this.chat.find({ idChat: id }).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
        return getData.reverse()
    }
    async getChatImageById(id: string, page: number, limit: number) {
        const data = await this.chatImage.find({ idChat: id }).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
        return data
    }
    async getChatDetailInfo(idChat: string) {
        const data = await this.chatInfo.findById({ _id: idChat })
        return data
    }

    async chatUpdate(_id: string, data: { [key: string]: string | number | boolean | [] | {} | any }) {
        const update = await this.chat.findByIdAndUpdate(_id, data)
        if (!update) {
            return false
        }
        return update
    }
    async chatInfoUpdate(_id: string, data: { [key: string]: string | number | boolean | [] | {} }) {
        return await this.chatInfo.findByIdAndUpdate(_id, data)
    }
    async chatImages(data: ChatImage[]) {
        const insert = await this.chatImage.insertMany(data)
        return insert
    }
}