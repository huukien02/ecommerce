import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

export class UserQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;
}
