import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderQueryDto } from './dto/order-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { User, UserRole } from '../user/user.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItem } from './order-item.entity';
import { Order, OrderStatus, PaymentStatus } from './order.entity';

const effectivePrice = (product: { price: string; salePrice?: string }) =>
    Number(product.salePrice ?? product.price);

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>,
        private readonly cartService: CartService,
        private readonly productService: ProductService,
    ) {}

    async checkout(userId: string, dto: CheckoutDto) {
        const cart = await this.cartService.getRawCart(userId);
        if (!cart.items?.length) throw new BadRequestException('Cart is empty');

        const orderItems: Partial<OrderItem>[] = [];
        let subtotal = 0;

        for (const cartItem of cart.items) {
            const product = cartItem.product;
            if (product.stock < cartItem.quantity) {
                throw new BadRequestException(`${product.name} is out of stock`);
            }

            const unitPrice = effectivePrice(product);
            const lineTotal = unitPrice * cartItem.quantity;
            subtotal += lineTotal;

            orderItems.push({
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                imageUrl: product.imageUrl,
                quantity: cartItem.quantity,
                unitPrice: unitPrice.toFixed(2),
                lineTotal: lineTotal.toFixed(2),
            });
        }

        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        const discount = 0;
        const total = subtotal + shippingFee - discount;

        const order = this.orderRepo.create({
            user: { id: userId } as User,
            items: orderItems,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.UNPAID,
            paymentMethod: dto.paymentMethod ?? 'cod',
            customerName: dto.customerName,
            phone: dto.phone,
            address: dto.address,
            note: dto.note,
            subtotal: subtotal.toFixed(2),
            shippingFee: shippingFee.toFixed(2),
            discount: discount.toFixed(2),
            total: total.toFixed(2),
        });

        const saved = await this.orderRepo.save(order);

        for (const cartItem of cart.items) {
            await this.productService.removeStock(cartItem.product.id, cartItem.quantity);
        }

        await this.cartService.clear(userId);

        return this.orderRepo.findOne({ where: { id: saved.id } });
    }

    async findMine(userId: string) {
        return this.orderRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async findAll(query: OrderQueryDto) {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 10);

        const qb = this.orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .orderBy('order.createdAt', 'DESC');

        if (query.search) {
            const s = `%${query.search}%`;
            qb.where(
                '(order.customerName ILIKE :s OR order.phone ILIKE :s OR CAST(order.id AS VARCHAR) ILIKE :s)',
                { s },
            );
        }

        const [items, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    async findOne(id: string, requester: { sub: string; role: UserRole }) {
        const order = await this.orderRepo.findOne({
            where:
                requester.role === UserRole.ADMIN
                    ? { id }
                    : { id, user: { id: requester.sub } },
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async cancel(id: string, userId: string) {
        const order = await this.orderRepo.findOne({ where: { id, user: { id: userId } } });
        if (!order) throw new NotFoundException('Order not found');
        if (order.status !== OrderStatus.PENDING) {
            throw new BadRequestException('Only pending orders can be cancelled');
        }

        order.status = OrderStatus.CANCELLED;
        return this.orderRepo.save(order);
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.orderRepo.findOne({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        order.status = dto.status;
        if (dto.status === OrderStatus.COMPLETED && order.paymentMethod === 'cod') {
            order.paymentStatus = PaymentStatus.PAID;
        }

        return this.orderRepo.save(order);
    }
}
