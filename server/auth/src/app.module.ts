import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './resources/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.NAME}:${process.env.PASS}@tech.of4l8iy.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority&ssl=true`),
    JwtModule.register({ global: true, secret: process.env.SECRET }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
