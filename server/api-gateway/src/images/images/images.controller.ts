import { Body, Controller, Get, Inject, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('api/images')
export class ImagesController {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy
    ) { }
    @Get('checked')
    async checked(@Res() res: Response) {
        const result = await firstValueFrom(this.natsClient.send({ cmd: 'checked' }, {}))
        return res.status(result.status).json(result)
    }
    @Post('upload/:folder')
    @UseInterceptors(FileInterceptor('file'))
    async createImage(@UploadedFile() file: Express.Multer.File, @Param('folder') folder: string, @Res() res: Response) {
        const isCreate = await firstValueFrom(this.natsClient.send({ cmd: 'create-image' }, {
            folder, file: {
                ...file,
                buffer: file.buffer.toString('base64')
            }
        }))
        return res.status(isCreate.status).json(isCreate)
    }
}
