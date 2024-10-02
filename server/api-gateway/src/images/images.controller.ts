import { Body, Controller, Get, Inject, Param, Post, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
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
    @UseInterceptors(FilesInterceptor('files', 10))
    async createImage(@UploadedFiles() files: Array<Express.Multer.File>, @Param('folder') folder: string, @Res() res: Response) {
        if (!files || files.length === 0) {
            return res.status(400).json({ status: 400, message: "No files uploaded" });
        }
        const file = files.map((f: Express.Multer.File) => {
            return {
                ...f,
                buffer: f.buffer.toString('base64')
            }
        })
        const isCreate = await firstValueFrom(this.natsClient.send({ cmd: 'create-image' }, {
            folder, file
        }))
        return res.status(isCreate.status).json(isCreate)
    }
}
