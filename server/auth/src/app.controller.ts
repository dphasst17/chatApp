import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('NATS_SERVICE') private natsClient: ClientProxy
  ) { }

  @EventPattern({ cmd: 'auth_checked' })
  async onAuthChecked() {
    return this.appService.index()
  }
}
