import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    getCart(@Req() req) {
        return this.cartService.getCart(req.user.sub);
    }

    @Post('items')
    addItem(@Req() req, @Body() dto: AddCartItemDto) {
        return this.cartService.addItem(req.user.sub, dto);
    }

    @Patch('items/:id')
    updateItem(@Req() req, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
        return this.cartService.updateItem(req.user.sub, id, dto);
    }

    @Delete('items/:id')
    removeItem(@Req() req, @Param('id') id: string) {
        return this.cartService.removeItem(req.user.sub, id);
    }

    @Delete()
    clear(@Req() req) {
        return this.cartService.clear(req.user.sub);
    }
}
