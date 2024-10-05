import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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
            {
                $match: { user: { $in: [idUser] } }
            },
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
                    userAction: {
                        $filter: {
                            input: '$userAction',
                            as: 'action',
                            cond: { $eq: ['$$action.idUser', idUser] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    deleteDate: {
                        $arrayElemAt: ['$userAction.date', 0]
                    }
                }
            },
            {
                $addFields: {
                    lastMessage: {
                        $arrayElemAt: [{
                            $filter: {
                                input: '$lastMessage',
                                as: 'message',
                                cond: {
                                    $cond: {
                                        if: { $eq: ['$type', 'group'] },
                                        then: {
                                            $cond: {
                                                if: { $ne: ['$deleteDate', null] },
                                                then: { $lt: ['$$message.date', '$deleteDate'] },
                                                else: { $gte: ['$$message.date', '$deleteDate'] }
                                            }
                                        },
                                        else: { $gte: ['$$message.date', '$deleteDate'] }
                                    }
                                }
                            }
                        }, -1]
                    }
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
            { $sort: { sortField: -1, _id: -1 } },// Sort theo created_at giảm dần
            {
                $project: {
                    _id: 1,
                    name: 1,
                    avatar: 1,
                    user: 1,
                    lastMessage: 1,
                    userAction: 1,
                    notification: 1,
                    type: 1,
                    deleteDate: 1
                }
            }
        ]);
        /* console.log(data) */
        return data;
    }
    async getCountChatDetail(idChat: string, type: "chat" | "image") {
        const data = await (type === "chat" ? this.chat : this.chatImage).aggregate([
            { $match: { idChat: idChat } },
            { $count: "count" }
        ])
        return data
    }
    async getChatDetail(idUser: string, id: string, page: number, limit: number) {
        const getInfo = await this.chatInfo.findOne({ _id: id }).exec();
        const dateFilter = getInfo.userAction.filter((item: any) => item.idUser === idUser)[0]
        const objDate = getInfo.type === "group" ? { $lte: dateFilter.date } : { $gte: dateFilter.date }
        const filterValue = dateFilter.date ? { idChat: id, date: objDate } : { idChat: id }
        const getItem = await this.chat.find(filterValue)
            .sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).lean()

        return getItem.reverse();
    }


    async getChatImageById(idUser: string, id: string, page: number, limit: number) {
        const getInfo = await this.chatInfo.findOne({ _id: id }).exec();
        const dateFilter = getInfo.userAction.filter((item: any) => item.idUser === idUser)[0]
        const objDate = getInfo.type === "group" ? { $lte: dateFilter.date } : { $gte: dateFilter.date }
        const filterValue = dateFilter.date ? { idChat: id, date: objDate } : { idChat: id }
        const data = await this.chatImage.find(filterValue).sort({ _id: -1 }).skip((page - 1) * limit).limit(limit)
        return data
    }
    async getChatDetailInfo(idChat: string) {
        const data = await this.chatInfo.findById({ _id: idChat }, { _id: 1, name: 1, avatar: 1, user: 1, time: 1, type: 1, notification: 1, owner: 1 })
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