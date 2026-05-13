import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { User } from '../user/user.entity';
import { CartItem } from './cart-item.entity';
import { CartController } from './cart.controller';
import { Cart } from './cart.entity';
import { CartService } from './cart.service';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem, User]), ProductModule, JwtModule.register({})],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService],
})
export class CartModule {}
