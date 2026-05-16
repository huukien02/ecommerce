import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class OrderQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;
}
