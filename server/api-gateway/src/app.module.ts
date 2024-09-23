import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthMiddleware } from './middleware/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { ImagesModule } from './images/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.SECRET }),
    AuthModule, UserModule, ChatModule, ImagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(
    consumer: MiddlewareConsumer
  ) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'api/auth/token', method: RequestMethod.PUT },
        { path: 'api/auth/password', method: RequestMethod.PATCH },
        { path: 'api/user', method: RequestMethod.GET },
        { path: 'api/user', method: RequestMethod.PATCH },
        { path: 'api/user/friend', method: RequestMethod.POST },
        { path: 'api/user/friend/:status', method: RequestMethod.GET },
        { path: 'api/chat', method: RequestMethod.GET },
        { path: 'api/chat', method: RequestMethod.POST },
        { path: 'api/chat/:id', method: RequestMethod.PATCH },
        { path: 'api/chat/:id', method: RequestMethod.POST },
      );
  }
}
