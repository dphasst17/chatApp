import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, NextFunction } from 'express';
import { RequestCustom } from 'src/interface/custom.interface';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    async use(req: RequestCustom, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new UnauthorizedException('Authorization header not found');
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token);
            if (!decoded) {
                throw new UnauthorizedException('Token has expired')
            };
            req.idUser = decoded.idUser;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}