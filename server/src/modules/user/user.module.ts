import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
    controllers: [UserController],
    providers: [UserService, RolesGuard],
    exports: [UserService],
})
export class UserModule { }
