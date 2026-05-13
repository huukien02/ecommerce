import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Category]), JwtModule.register({})],
    controllers: [CategoryController],
    providers: [CategoryService, RolesGuard],
    exports: [CategoryService],
})
export class CategoryModule {}
