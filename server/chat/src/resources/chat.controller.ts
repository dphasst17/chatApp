import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService: ChatService
    ) { }
    @EventPattern({ cmd: 'chat_checked' })
    async chatChecked() {
        return "Chat service is up and running!";
    }
}
