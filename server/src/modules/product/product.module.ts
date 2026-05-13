import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category]), JwtModule.register({})],
    controllers: [ProductController],
    providers: [ProductService, RolesGuard],
    exports: [ProductService],
})
export class ProductModule {}
