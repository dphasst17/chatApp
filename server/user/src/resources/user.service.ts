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
    async search(key: string) {
        const data = await this.userRepository.search(key)
        if (!data) {
            return { status: 404, message: "No data" }
        }
        return { status: 200, data: data }
    }
    async getInfo(idUser: string) {
        const data = await this.userRepository.getInfo(idUser)
        if (!data) {
            return { status: 404, message: "User not found" }
        }
        return { status: 200, data: data }
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

    async friendGetByStatus(idUser: string, status: string) {
        const data = await this.userRepository.friendGetByStatus(idUser, status)
        if (!data) {
            return { status: 404, message: "Friend not found" }
        }
        return { status: 200, data: data }
    }
    async addFriend(data: { idUser: string, idFriend: string, status: string, created_at: Date, updated_at: Date }) {
        const create = await this.userRepository.addFriend(data)
        if (!create) {
            return { status: 403, message: "Add friend is failed" }
        }
        return { status: 200, message: "Add friend is success" }
    }

    async updateFriend(id: string, data: { [key: string]: string }) {
        const update = await this.userRepository.updateFriend(id, data)
        if (!update) {
            return { status: 403, message: "Update friend is failed" }
        }
        return { status: 200, message: "Update friend is success" }
    }

    async removeFriend(id: string) {
        const remove = await this.userRepository.removeFriend(id)
        if (!remove) {
            return { status: 403, message: "Remove friend is failed" }
        }
        return { status: 200, message: "Remove friend is success" }
    }
}