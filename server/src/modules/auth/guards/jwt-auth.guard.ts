import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject('REDIS') private readonly redis: Redis,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded: any = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });

            if (!decoded?.sub) {
                throw new UnauthorizedException('Invalid token payload');
            }

            // 🔥 CHECK BLACKLIST
            const isBlacklisted = await this.redis.get(`blacklist:${decoded.jti}`);

            if (isBlacklisted) {
                throw new UnauthorizedException('Token revoked (logout)');
            }

            request.user = decoded;

            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}