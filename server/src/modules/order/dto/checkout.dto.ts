import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CheckoutDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    customerName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    phone: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    address: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    note?: string;

    @IsOptional()
    @IsIn(['cod'])
    paymentMethod?: 'cod';
}
