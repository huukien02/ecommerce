import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../product.entity';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @MaxLength(180)
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    salePrice?: number;

    @IsOptional()
    @IsString()
    @MaxLength(80)
    sku?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsUrl({ require_protocol: true })
    imageUrl?: string;

    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

    @IsOptional()
    @IsString()
    categoryId?: string | null;
}
