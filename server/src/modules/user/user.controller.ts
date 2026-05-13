import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    Query,
    Post,
    UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll(@Query() query: PaginationDto) {
        return this.userService.findAll(query);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.userService.findById(id);
    }
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.softDelete(id);
    }
}
