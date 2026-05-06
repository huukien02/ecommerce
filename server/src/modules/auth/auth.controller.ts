import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // 🔐 LOGIN → trả access + refresh
    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }

    // 🧾 REGISTER
    @Post('register')
    register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }

    // 👤 GET ME (access token)
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req) {
        return req.user;
    }

    // 🔄 REFRESH ACCESS TOKEN
    @Post('refresh')
    refresh(@Body('refresh_token') refreshToken: string) {
        return this.authService.refreshToken(refreshToken);
    }

    // 🚪 LOGOUT
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@Req() req) {
        return this.authService.logout(req.user.sub, req.user.jti);
    }
}