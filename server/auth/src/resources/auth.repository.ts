import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Auth } from "src/auth.schema";

export class AuthRepository {
    constructor(
        @InjectModel('auth') private readonly auth: Model<Auth>,
    ) { }
    async getData(username: string) {
        const data = await this.auth.findOne({ username }).exec()
        return data
    }
    async register(data: { [key: string]: string | number | Date }) {
        return await this.auth.create(data)
    }
    async updateAuth(idUser: string, data: { [key: string]: string | number | boolean | any }) {
        return await this.auth.findByIdAndUpdate({ idUser: idUser }, data)
    }
    async removeAccount(idUser: string) {
        return await this.auth.deleteOne({ idUser: idUser })
    }
}