import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {

    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private readonly userService: UserService
    ) { }
    @EventPattern({ cmd: 'user_index' })
    async index(data?: string) {
        return this.userService.index()
    }
    @EventPattern({ cmd: 'user_create' })
    async create(data: { [key: string]: string | number | Date }): Promise<boolean> {
        return this.userService.createUser(data)
    }

    @EventPattern({ cmd: 'user_search' })
    async search(key: string) {
        return this.userService.search(key)
    }
    //get info user with id user and return name,avatar and idUser
    @EventPattern({ cmd: 'user_get_info' })
    async getInfo(value: { idUser: string, rValue: string }) {
        const result = await this.userService.getInfo(value.idUser)
        return result.data[0][value.rValue]
    }

    @EventPattern({ cmd: 'user_update' })
    async update({ idUser, data }: { idUser: string, data: { [key: string]: string | number | boolean | any } }): Promise<{ status: number, message: string }> {
        return this.userService.update(idUser, data)
    }
    //get info user when login or user access the website
    @EventPattern({ cmd: 'user_get' })
    async getData(idUser: string) {
        return this.userService.getData(idUser)
    }

    @EventPattern({ cmd: 'friend_status' })
    async friendGetByStatus(data: { idUser: string, status: string }) {
        return this.userService.friendGetByStatus(data.idUser, data.status)
    }

    @EventPattern({ cmd: 'friend_add' })
    async addFriend(data: { idUser: string, idFriend: string, status: string, created_at: Date, updated_at: Date }) {
        return this.userService.addFriend(data)
    }

    @EventPattern({ cmd: 'friend_update' })
    async updateFriend(data: { [key: string]: string }) {
        return this.userService.updateFriend(data)
    }

    @EventPattern({ cmd: 'friend_remove' })
    async removeFriend(id: string) {
        return this.userService.removeFriend(id)
    }
}
