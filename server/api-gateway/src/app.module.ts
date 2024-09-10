import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthMiddleware } from './middleware/token.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({ global: true, secret: process.env.SECRET }),
    AuthModule, UserModule/* ChatModule, UserModule */
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
        { path: 'api/user', method: RequestMethod.PATCH }
      );
  }
}
