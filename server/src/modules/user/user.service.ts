import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';

import { User } from './user.entity';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import { paginate } from '../../common/pagination/pagination.util';

// 👉 DTO (bạn cần tạo file riêng)
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    // 👉 CREATE
    async create(data: CreateUserDto) {
        // validate
        if (!data.email || !data.password || !data.name) {
            throw new BadRequestException('Missing required fields');
        }

        // check email
        const existed = await this.userRepo.findOne({
            where: { email: data.email },
        });

        if (existed) {
            throw new ConflictException('Email already exists');
        }

        // hash password
        const hashed = await bcrypt.hash(data.password, 10);

        const user = this.userRepo.create({
            ...data,
            password: hashed,
        });

        const saved = await this.userRepo.save(user);

        return this.transform(saved);
    }

    // 👉 FIND BY EMAIL (auth dùng)
    async findByEmail(email: string) {
        return this.userRepo.findOne({
            where: { email },
        });
    }

    // 👉 FIND BY ID
    async findById(id: string) {
        const user = await this.userRepo.findOne({
            where: { id, isActive: true },
        });

        if (!user) throw new NotFoundException('User not found');

        return this.transform(user);
    }

    // 👉 PAGINATION
    async findAll(query: PaginationDto) {
        const result = await paginate(
            this.userRepo,
            {
                where: { isActive: true },
                order: { createdAt: 'DESC' },
            },
            query,
        );

        return {
            items: result.data.map((u) => this.transform(u)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }

    // 👉 UPDATE
    async update(id: string, data: UpdateUserDto) {
        const user = await this.userRepo.findOne({
            where: { id, isActive: true },
        });

        if (!user) throw new NotFoundException('User not found');

        // check email duplicate
        if (data.email && data.email !== user.email) {
            const existed = await this.userRepo.findOne({
                where: { email: data.email },
            });

            if (existed) {
                throw new ConflictException('Email already exists');
            }
        }

        // hash password nếu có
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        Object.assign(user, data);

        const updated = await this.userRepo.save(user);

        return this.transform(updated);
    }

    // 👉 SOFT DELETE
    async softDelete(id: string) {
        const user = await this.userRepo.findOne({
            where: { id, isActive: true },
        });

        if (!user) throw new NotFoundException('User not found');

        user.isActive = false;

        await this.userRepo.save(user);

        return { message: 'User deleted' };
    }

    // 👉 TRANSFORM
    private transform(user: User) {
        return plainToInstance(User, user);
    }
}