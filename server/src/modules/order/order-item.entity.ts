import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    order: Order;

    @Column()
    productId: string;

    @Column()
    productName: string;

    @Column()
    sku: string;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    unitPrice: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    lineTotal: string;
}
