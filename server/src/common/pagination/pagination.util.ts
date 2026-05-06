import { ObjectLiteral, Repository, FindManyOptions } from 'typeorm';
import { PaginationDto } from './pagination.dto';
import { PaginationResult } from './pagination.interface';

export async function paginate<T extends ObjectLiteral>(
    repo: Repository<T>,
    options: FindManyOptions<T>,
    pagination: PaginationDto,
): Promise<PaginationResult<T>> {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;

    const [data, total] = await repo.findAndCount({
        ...options,
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}