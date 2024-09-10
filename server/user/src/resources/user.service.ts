import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository
    ) { }
    async index() {
        return await this.userRepository.index()
    }
    async createUser(data: { [key: string]: string | number | Date }) {
        const create_data = await this.userRepository.createData(data)
        if (!create_data) {
            return false
        }
        return true
    }

    async getData(idUser: string) {
        const data = await this.userRepository.getData(idUser)
        if (!data) {
            return { status: 404, message: "User not found" }
        }
        return { status: 200, data: data }
    }

    async update(idUser: string, data: { [key: string]: string | number | boolean | any }) {
        const update = await this.userRepository.update(idUser, data)
        if (!update) {
            return { status: 404, message: "Update is failed" }
        }
        return { status: 200, message: "Update is success" }
    }
}