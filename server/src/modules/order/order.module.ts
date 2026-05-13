import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { OrderItem } from './order-item.entity';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartModule, ProductModule, JwtModule.register({})],
    controllers: [OrderController],
    providers: [OrderService, RolesGuard],
})
export class OrderModule {}
