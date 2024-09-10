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
        console.log(data)
        return this.userService.index()/* "User service is up and running!"; */
        /* return this.userService.index() */
    }
    @EventPattern({ cmd: 'user_create' })
    async create(data: { [key: string]: string | number | Date }): Promise<boolean> {
        return this.userService.createUser(data)
    }

    @EventPattern({ cmd: 'user_update' })
    async update({ idUser, data }: { idUser: string, data: { [key: string]: string | number | boolean | any } }): Promise<{ status: number, message: string }> {
        return this.userService.update(idUser, data)
    }

    @EventPattern({ cmd: 'user_get' })
    async getData(idUser: string) {
        return this.userService.getData(idUser)
    }
}
