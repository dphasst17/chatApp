import { Module } from '@nestjs/common';
import { NatsClientModule } from 'src/nast-client/nast-client.module';
import { ImagesController } from './images.controller';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
    imports: [NatsClientModule, NestjsFormDataModule],
    controllers: [ImagesController],
})
export class ImagesModule { }
