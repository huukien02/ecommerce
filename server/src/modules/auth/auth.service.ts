import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @Inject('REDIS') private readonly redis: Redis,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            this.logger.warn(`Login failed - user not found: ${email}`);
            throw new UnauthorizedException('User not found');
        }

        if (!user.isActive) {
            this.logger.warn(`Login failed - inactive account: ${email}`);
            throw new UnauthorizedException('User is inactive');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            this.logger.warn(`Login failed - wrong password: ${email}`);
            throw new UnauthorizedException('Wrong password');
        }

        return user;
    }

    async login(data: LoginDto) {
        const user = await this.validateUser(data.email, data.password);

        const jti = uuidv4();

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            jti,
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.ensureEnv('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.ensureEnv('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.redis.set(
            `refresh:${user.id}:${jti}`,
            hashedRefreshToken,
            'EX',
            7 * 24 * 60 * 60,
        );

        this.logger.log(`Login success: ${user.email} (id=${user.id})`);

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    async register(data: RegisterDto) {
        const existing = await this.userService.findByEmail(data.email);
        if (existing) {
            this.logger.warn(`Register failed - email already exists: ${data.email}`);
            throw new BadRequestException('Email already exists');
        }

        const hashed = await bcrypt.hash(data.password, 10);

        const user = await this.userService.create({
            ...data,
            password: hashed,
        });

        this.logger.log(`Register success: ${user.email} (id=${user.id})`);
        return user;
    }

    async refreshToken(refreshToken: string) {
        let decoded: any;

        try {
            decoded = this.jwtService.verify(refreshToken, {
                secret: this.ensureEnv('JWT_REFRESH_SECRET'),
            });
        } catch (err) {
            this.logger.warn('Refresh token failed - invalid token');
            throw new UnauthorizedException('Invalid refresh token');
        }

        const key = `refresh:${decoded.sub}:${decoded.jti}`;

        const stored = await this.redis.get(key);

        if (!stored) {
            this.logger.warn(`Refresh token not found in Redis: userId=${decoded.sub}`);
            throw new UnauthorizedException('Refresh token not found');
        }

        const isValid = await bcrypt.compare(refreshToken, stored);

        if (!isValid) {
            this.logger.warn(`Refresh token mismatch: userId=${decoded.sub}`);
            throw new UnauthorizedException('Invalid refresh token');
        }

        await this.redis.del(key);
        this.logger.log(`Token refreshed: userId=${decoded.sub}`);

        return this.issueNewTokens(decoded);
    }

    async issueNewTokens(payload: any) {
        const newJti = uuidv4();

        const newPayload = {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
            jti: newJti,
        };

        const accessToken = await this.jwtService.signAsync(newPayload, {
            secret: this.ensureEnv('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync(newPayload, {
            secret: this.ensureEnv('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
        });

        const hashed = await bcrypt.hash(refreshToken, 10);

        await this.redis.set(
            `refresh:${payload.sub}:${newJti}`,
            hashed,
            'EX',
            7 * 24 * 60 * 60,
        );

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }

    // 🧠 helper safety
    private ensureEnv(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`${key} is not defined`);
        }
        return value;
    }

    // (OPTIONAL) logout 1 device
    async logout(userId: string, jti: string) {
        const key = `refresh:${userId}:${jti}`;

        const exists = await this.redis.get(key);

        if (!exists) {
            this.logger.warn(`Logout - session already expired: userId=${userId}`);
            return { message: 'Session already logged out' };
        }

        await this.redis.del(key);

        await this.redis.set(
            `blacklist:${jti}`,
            '1',
            'EX',
            15 * 60
        );

        this.logger.log(`Logout success: userId=${userId}`);
        return { message: 'Logout success' };
    }

    // (OPTIONAL) logout all devices
    async logoutAll(userId: string) {
        const keys = await this.redis.keys(`refresh:${userId}:*`);
        if (keys.length) {
            await this.redis.del(keys);
        }
    }
}