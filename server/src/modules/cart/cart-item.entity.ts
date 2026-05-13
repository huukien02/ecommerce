import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { Cart } from './cart.entity';

@Entity('cart_items')
@Unique(['cart', 'product'])
export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
    product: Product;

    @Column({ default: 1 })
    quantity: number;
}
