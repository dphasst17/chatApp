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
        const { username, password } = data
        const getData = await this.authRepository.getData(username)
        if (!getData) {
            return { status: 404, message: "Username does not exist" }
        }
        if (!this.decodePass(password, getData.password)) {
            return { status: 401, message: "Password is incorrect" }
        }
        const token = this.generateToken(getData.idUser, "a")
        const refreshToken = this.generateToken(getData.idUser, "r")
        const update = await firstValueFrom(this.natsClient.send({
            cmd: 'user_update'
        }, { idUser: getData.idUser, data: { online: true } }))
        if (!update) {
            return { status: 500, message: "Login is failed" }
        }
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
        const register = await this.authRepository.register({ username, password: hash, idUser: username, createdAt: new Date(), action: 'active' })
        const created_user = register && await firstValueFrom(this.natsClient.send(
            { cmd: 'user_create' },
            {
                name: name,
                email: email,
                phone: '',
                avatar: '',
                idUser: username,
                online: false
            }))
        if (!created_user) {
            await this.removeAccount(username)
            return { status: 403, message: "Register is failed" }
        }
        if (!register) {
            return { status: 403, message: "Register is failed" }
        }
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
