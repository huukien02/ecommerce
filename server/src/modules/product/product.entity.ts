import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

export enum ProductStatus {
    ACTIVE = 'active',
    DRAFT = 'draft',
    OUT_OF_STOCK = 'out_of_stock',
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column()
    name: string;

    @Index({ unique: true })
    @Column()
    slug: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
    salePrice?: string;

    @Index({ unique: true })
    @Column()
    sku: string;

    @Column({ default: 0 })
    stock: number;

    @Column({ nullable: true })
    imageUrl?: string;

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.ACTIVE,
    })
    status: ProductStatus;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: true,
        eager: true,
        onDelete: 'SET NULL',
    })
    category?: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
