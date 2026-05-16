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

    /** 'all' = không lọc status (dành cho admin). Mặc định chỉ trả về 'active'. */
    @IsOptional()
    @IsIn(['active', 'draft', 'out_of_stock', 'all'])
    status?: 'active' | 'draft' | 'out_of_stock' | 'all';
}
