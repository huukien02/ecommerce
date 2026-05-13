import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class ProductQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    categoryId?: string;

    @IsOptional()
    @IsIn(['newest', 'price_asc', 'price_desc'])
    sort?: 'newest' | 'price_asc' | 'price_desc';
}
