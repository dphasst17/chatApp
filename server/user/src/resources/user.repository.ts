import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user.schema";
import { Friend } from "src/userFriend.schema";


export class UserRepository {
    constructor(
        @InjectModel('user') private readonly user: Model<User>,
        @InjectModel('friend') private readonly friend: Model<Friend>,
    ) { }
    async index() {
        return "User service is up and running!"
    }
    async createData(data: { [key: string]: string | number | Date }) {
        const create_user_data = await this.user.create(data)
        return create_user_data
    }
    async search(key: string) {
        return this.user.aggregate([
            { $match: { $or: [{ name: { $regex: key, $options: 'i' } }] } },
            {
                $project: {
                    _id: '$_id',
                    idUser: '$idUser',
                    name: '$name',
                    avatar: '$avatar',
                }
            }
        ]);

    }
    async getInfo(idUser: string) {
        return await this.user.find({ idUser: idUser }, { _id: 1, idUser: 1, name: 1, avatar: 1 }).exec()
    }
    async getData(idUser: string) {
        const info = await this.user.findOne({ idUser: idUser }).lean()
        return info
    }
    async update(idUser: string, data: { [key: string]: string | number | boolean | any }) {
        const update = await this.user.findOneAndUpdate({ idUser: idUser }, data)
        if (!update) {
            return { status: 404, message: "Update is failed" }
        }
        return { status: 200, message: "Update is success" }
    }
    async friendGetByStatus(idUser: string, status: string) {
        const dataFilter = { $or: [{ idUser: idUser }, { idFriend: idUser }], status: status };
        return this.friend.aggregate([
            { $match: dataFilter },
            {
                $lookup: {
                    from: 'user',
                    let: { friendId: { $cond: [{ $eq: ["$idUser", idUser] }, "$idFriend", "$idUser"] } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$idUser", "$$friendId"] } } },
                        { $project: { idUser: 1, name: 1, avatar: 1, online: 1, _id: 0 } }
                    ],
                    as: 'friend'
                }
            },
            { $project: { _id: 1, idUser: 1, idFriend: 1, status: 1, created_at: 1, updated_at: 1, friend: { $arrayElemAt: ['$friend', 0] } } }
        ]);
    }

    async addFriend(data: { idUser: string, idFriend: string, status: string, created_at: Date, updated_at: Date }) {
        //create data and return _id
        const create = await this.friend.create(data)
        if (!create) {
            return { status: 403, message: "Add friend is failed" }
        }
        return create
    }
    async updateFriend(id: string, data: { [key: string]: string }) {
        return await this.friend.findByIdAndUpdate(id, data)
    }
    async removeFriend(id: string) {
        return await this.friend.findByIdAndDelete(id)
    }
}