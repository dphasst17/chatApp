import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginRequest, AuthRegisterRequest } from 'src/auth.interface';
import * as bcrypt from 'bcrypt'
import { AuthRepository } from './auth.repository';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private readonly jwtService: JwtService,
        private readonly authRepository: AuthRepository
    ) { }
    private generateToken = (id: string, type: "a" | "r") => {
        const token = this.jwtService.sign({ idUser: id }, { expiresIn: type === "a" ? "15m" : "5d" })
        const expired = this.jwtService.decode(token).exp
        return {
            [`${type}`]: token, [`e${type}`]: expired
        }

    }
    private encodePass = (password: string) => {
        const saltRound = process.env.SALT as string
        const salt = bcrypt.genSaltSync(Number(saltRound));
        return bcrypt.hashSync(password, salt);
    }
    private decodePass = (password: string, hash: string) => {
        return bcrypt.compareSync(password, hash)
    }
    index() {
        return "Auth service is up and running!";
    }
    async login(data: AuthLoginRequest) {
        const username = data.username || data.email
        const getRedis = await firstValueFrom(this.natsClient.send(
            { cmd: 'redis_get' }, { key: `auth_${username}` }
        ))
        const getData = !getRedis ? await this.authRepository.getData(username) : getRedis
        if (!data.email && !getData) {
            return { status: 404, message: "Username does not exist" }
        }
        const idUser = getData.idUser || data.email.split('@')[0]
        if (data.email && !getData) {
            const register = await this.register({ idUser, username, password: data.password, name: data.name, email: data.email })
            const token = register.status === 201 && this.generateToken(idUser, "a")
            const refreshToken = register.status === 201 && this.generateToken(getData.idUser, "r")
            return register.status === 201 ? {
                status: 200, data: {
                    ...token,
                    ...refreshToken
                }
            } : register
        }
        if (!data.email && !this.decodePass(data.password, getData.password)) {
            return { status: 401, message: "Password is incorrect" }
        }
        if (!getRedis) {
            await firstValueFrom(this.natsClient.send(
                { cmd: 'redis_set' },
                {
                    key: `auth_${username}`,
                    value: {
                        username: username,
                        password: getData.password,
                        action: 'active'

                    }
                }
            ))
        }
        const token = this.generateToken(idUser, "a")
        const refreshToken = this.generateToken(getData.idUser, "r")
        return {
            status: 200, data: {
                ...token,
                ...refreshToken
            }
        }
    }
    async register(data: AuthRegisterRequest) {
        const { username, password, name, email } = data
        const getData = await this.authRepository.getData(username)

        if (getData) {
            return {
                status: 403, message: "Username already exist"
            }
        }
        const hash = this.encodePass(password)
        const register = await this.authRepository.register({ username, password: hash, idUser: data.idUser || username, createdAt: new Date(), action: 'active' })
        const created_user = register && await firstValueFrom(this.natsClient.send(
            { cmd: 'user_create' },
            {
                name: name,
                email: email,
                phone: '',
                avatar: '',
                idUser: data.idUser || username,
                online: false
            }))
        if (!created_user) {
            await this.removeAccount(username)
            return { status: 403, message: "Register is failed" }
        }
        if (!register) {
            return { status: 403, message: "Register is failed" }
        }
        await firstValueFrom(this.natsClient.send(
            { cmd: 'redis_set' },
            {
                key: `auth_${username}`,
                value: {
                    username: username,
                    password: hash,
                    action: 'active'
                }
            }
        ))
        await firstValueFrom(this.natsClient.send(
            { cmd: 'redis_set' },
            {
                key: `user_${username}`,
                value: {
                    name: name,
                    email: email,
                    phone: '',
                    avatar: '',
                    idUser: username,
                    online: false
                }
            }
        ))
        return {
            status: 201, message: "Register success"
        }
    }

    async newToken(id: string) {
        const idUser = id
        const token = this.generateToken(idUser, "a")
        return {
            status: 200, data: token
        }
    }
    async password(idUser: string, data: { current: string, password: string }) {
        const getData = await this.authRepository.getData(idUser)
        const checkPass = this.decodePass(data.current, getData.password)
        if (!checkPass) {
            return { status: 401, message: "Password is incorrect" }
        }
        const hash = this.encodePass(data.password)
        const update = await this.authRepository.updateAuth(idUser, { password: hash })
        if (!update) {
            return { status: 403, message: "Update password is failed" }
        }
        return {
            status: 200, message: "Update password success"
        }
    }
    private removeAccount = async (id: string) => {
        return await this.authRepository.removeAccount(id)
    }

}
