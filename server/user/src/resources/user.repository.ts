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
        return this.user.findOne({ idUser: idUser }, { _id: 1, idUser: 1, name: 1, avatar: 1 })
    }
    async getData(idUser: string) {
        const info = await this.user.findOne({ idUser: idUser }).lean()
        const friend = await this.friend.find({ $or: [{ idUser: idUser }, { idFriend: idUser }] }).lean()
        return { ...info, friend: friend }
    }
    async update(idUser: string, data: { [key: string]: string | number | boolean | any }) {
        return await this.user.findOneAndUpdate({ idUser: idUser }, data)
    }
    async friendGetByStatus(idUser: string, status: string) {
        return this.friend.find({ $or: [{ idUser: idUser }, { idFriend: idUser }], status: status })
    }
    async addFriend(data: { idUser: string, idFriend: string, status: string, created_at: Date, updated_at: Date }) {
        return this.friend.create(data)
    }
    async updateFriend(id: string, data: { [key: string]: string }) {
        return this.friend.findByIdAndUpdate(id, data)
    }
    async removeFriend(id: string) {
        return this.friend.findByIdAndDelete(id)
    }
}