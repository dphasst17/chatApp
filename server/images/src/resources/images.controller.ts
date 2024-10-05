import { Controller, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { EventPattern } from '@nestjs/microservices';
import { FileUpload } from 'src/images.interface';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {
  }
  @EventPattern({ cmd: 'checked' })
  async checked() {
    const result = await this.imagesService.checked();
    return result
  }
  @EventPattern({ cmd: 'create-image' })
  async createImage(data: { folder: string, file: FileUpload[] }) {
    const file: Express.Multer.File[] = data.file.map((f: FileUpload) => {
      return {
        ...f,
        buffer: Buffer.from(f.buffer, 'base64')
      }
    });
    const isCreate = await this.imagesService.createImage(data.folder, file);
    return isCreate
  }
}
