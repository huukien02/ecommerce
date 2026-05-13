import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatus } from './product.entity';

const toSlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(dto: CreateProductDto) {
        await this.ensureSkuAvailable(dto.sku);
        const slug = await this.makeUniqueSlug(dto.name);
        const category = dto.categoryId ? await this.findCategory(dto.categoryId) : undefined;

        const product = this.productRepo.create({
            ...dto,
            price: dto.price.toFixed(2),
            salePrice: dto.salePrice?.toFixed(2),
            slug,
            category,
        });

        return this.productRepo.save(product);
    }

    async findAll(query: ProductQueryDto) {
        const page = Number(query.page || 1);
        const limit = Number(query.limit || 12);
        const qb = this.productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .where('product.status = :status', { status: ProductStatus.ACTIVE });

        if (query.search) {
            qb.andWhere('(LOWER(product.name) LIKE :search OR LOWER(product.sku) LIKE :search)', {
                search: `%${query.search.toLowerCase()}%`,
            });
        }

        if (query.categoryId) {
            qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
        }

        if (query.sort === 'price_asc') qb.orderBy('COALESCE(product.salePrice, product.price)', 'ASC');
        else if (query.sort === 'price_desc') qb.orderBy('COALESCE(product.salePrice, product.price)', 'DESC');
        else qb.orderBy('product.createdAt', 'DESC');

        const [items, total] = await qb
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string) {
        const product = await this.productRepo.findOne({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async findActiveById(id: string) {
        const product = await this.productRepo.findOne({
            where: { id, status: ProductStatus.ACTIVE },
        });
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        const product = await this.findById(id);

        if (dto.sku && dto.sku !== product.sku) {
            await this.ensureSkuAvailable(dto.sku, id);
            product.sku = dto.sku;
        }

        if (dto.name && dto.name !== product.name) {
            product.name = dto.name;
            product.slug = await this.makeUniqueSlug(dto.name, id);
        }

        if (dto.categoryId !== undefined) {
            product.category = dto.categoryId ? await this.findCategory(dto.categoryId) : undefined;
        }

        if (dto.description !== undefined) product.description = dto.description;
        if (dto.price !== undefined) product.price = dto.price.toFixed(2);
        if (dto.salePrice !== undefined) product.salePrice = dto.salePrice.toFixed(2);
        if (dto.stock !== undefined) product.stock = dto.stock;
        if (dto.imageUrl !== undefined) product.imageUrl = dto.imageUrl;
        if (dto.status !== undefined) product.status = dto.status;

        return this.productRepo.save(product);
    }

    async removeStock(productId: string, quantity: number) {
        const product = await this.findActiveById(productId);
        if (product.stock < quantity) {
            throw new ConflictException(`${product.name} is out of stock`);
        }
        product.stock -= quantity;
        if (product.stock === 0) product.status = ProductStatus.OUT_OF_STOCK;
        await this.productRepo.save(product);
        return product;
    }

    async softDelete(id: string) {
        const product = await this.findById(id);
        product.status = ProductStatus.DRAFT;
        await this.productRepo.save(product);
        return { message: 'Product deleted' };
    }

    private async findCategory(id: string) {
        const category = await this.categoryRepo.findOne({ where: { id, isActive: true } });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    private async ensureSkuAvailable(sku: string, currentId?: string) {
        const existed = await this.productRepo.findOne({ where: { sku } });
        if (existed && existed.id !== currentId) throw new ConflictException('SKU already exists');
    }

    private async makeUniqueSlug(name: string, currentId?: string) {
        const base = toSlug(name);
        let slug = base;
        let counter = 1;

        while (true) {
            const existed = await this.productRepo.findOne({ where: { slug } });
            if (!existed || existed.id === currentId) return slug;
            counter += 1;
            slug = `${base}-${counter}`;
        }
    }
}
