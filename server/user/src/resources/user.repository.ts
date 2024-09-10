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
    async getData(idUser: string) {
        const info = await this.user.findOne({ idUser: idUser }).lean()
        const friend = await this.friend.find({ $or: [{ idUser: idUser }, { idFriend: idUser }] }).lean()
        return { ...info, friend: friend }
    }
    async update(idUser: string, data: { [key: string]: string | number | boolean | any }) {
        return await this.user.findOneAndUpdate({ idUser: idUser }, data)
    }
}