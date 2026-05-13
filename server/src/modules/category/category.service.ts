import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const toSlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(dto: CreateCategoryDto) {
        const slug = toSlug(dto.name);
        await this.ensureSlugAvailable(slug);

        const category = this.categoryRepo.create({ ...dto, slug });
        return this.categoryRepo.save(category);
    }

    findAll() {
        return this.categoryRepo.find({
            where: { isActive: true },
            order: { name: 'ASC' },
        });
    }

    async findById(id: string) {
        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) throw new NotFoundException('Category not found');
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        const category = await this.findById(id);

        if (dto.name && dto.name !== category.name) {
            const slug = toSlug(dto.name);
            await this.ensureSlugAvailable(slug, id);
            category.slug = slug;
            category.name = dto.name;
        }

        if (dto.description !== undefined) category.description = dto.description;
        if (dto.isActive !== undefined) category.isActive = dto.isActive;

        return this.categoryRepo.save(category);
    }

    async softDelete(id: string) {
        const category = await this.findById(id);
        category.isActive = false;
        await this.categoryRepo.save(category);
        return { message: 'Category deleted' };
    }

    private async ensureSlugAvailable(slug: string, currentId?: string) {
        const existed = await this.categoryRepo.findOne({ where: { slug } });
        if (existed && existed.id !== currentId) {
            throw new ConflictException('Category already exists');
        }
    }
}
