import { Controller, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { AuthLoginRequest, AuthRegisterRequest } from 'src/auth.interface';

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @EventPattern({ cmd: 'auth_checked' })
    async onAuthChecked() {
        return this.authService.index()
    }
    @EventPattern({ cmd: 'login' })
    async authLogin(data: AuthLoginRequest) {
        return this.authService.login(data)
    }

    @EventPattern({ cmd: 'register' })
    async authRegister(data: AuthRegisterRequest) {
        return this.authService.register(data)
    }

    @EventPattern({ cmd: 'token' })
    async token(id: string) {
        return this.authService.newToken(id)
    }
}
