import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPING = 'shipping',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true,
        eager: true,
    })
    items: OrderItem[];

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.UNPAID,
    })
    paymentStatus: PaymentStatus;

    @Column({ default: 'cod' })
    paymentMethod: string;

    @Column()
    customerName: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ nullable: true })
    note?: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    shippingFee: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    discount: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    total: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
