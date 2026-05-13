import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { User } from '../user/user.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './cart-item.entity';
import { Cart } from './cart.entity';

const effectivePrice = (product: { price: string; salePrice?: string }) =>
    Number(product.salePrice ?? product.price);

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepo: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepo: Repository<CartItem>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly productService: ProductService,
    ) {}

    async getCart(userId: string) {
        const cart = await this.getOrCreateCart(userId);
        return this.withTotals(cart);
    }

    async addItem(userId: string, dto: AddCartItemDto) {
        const cart = await this.getOrCreateCart(userId);
        const product = await this.productService.findActiveById(dto.productId);

        if (product.stock < dto.quantity) {
            throw new BadRequestException('Not enough product stock');
        }

        const existed = cart.items?.find((item) => item.product.id === product.id);
        if (existed) {
            const nextQuantity = existed.quantity + dto.quantity;
            if (product.stock < nextQuantity) {
                throw new BadRequestException('Not enough product stock');
            }
            existed.quantity = nextQuantity;
            await this.cartItemRepo.save(existed);
        } else {
            const item = this.cartItemRepo.create({ cart, product, quantity: dto.quantity });
            await this.cartItemRepo.save(item);
        }

        return this.getCart(userId);
    }

    async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
        const cart = await this.getOrCreateCart(userId);
        const item = cart.items?.find((entry) => entry.id === itemId);
        if (!item) throw new NotFoundException('Cart item not found');

        if (item.product.stock < dto.quantity) {
            throw new BadRequestException('Not enough product stock');
        }

        item.quantity = dto.quantity;
        await this.cartItemRepo.save(item);

        return this.getCart(userId);
    }

    async removeItem(userId: string, itemId: string) {
        const cart = await this.getOrCreateCart(userId);
        const item = cart.items?.find((entry) => entry.id === itemId);
        if (!item) throw new NotFoundException('Cart item not found');

        await this.cartItemRepo.remove(item);
        return this.getCart(userId);
    }

    async clear(userId: string) {
        const cart = await this.getOrCreateCart(userId);
        if (cart.items?.length) await this.cartItemRepo.remove(cart.items);
        return this.getCart(userId);
    }

    async getRawCart(userId: string) {
        return this.getOrCreateCart(userId);
    }

    private async getOrCreateCart(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId, isActive: true } });
        if (!user) throw new NotFoundException('User not found');

        let cart = await this.cartRepo.findOne({
            where: { user: { id: userId } },
        });

        if (!cart) {
            cart = await this.cartRepo.save(this.cartRepo.create({ user, items: [] }));
        }

        cart.items = cart.items ?? [];
        return cart;
    }

    private withTotals(cart: Cart) {
        const items = (cart.items ?? []).map((item) => {
            const unitPrice = effectivePrice(item.product);
            const lineTotal = unitPrice * item.quantity;
            return { ...item, unitPrice, lineTotal };
        });

        const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

        return {
            ...cart,
            items,
            subtotal,
            totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        };
    }
}
