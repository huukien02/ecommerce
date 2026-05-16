import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../user/user.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('checkout')
    checkout(@Req() req, @Body() dto: CheckoutDto) {
        return this.orderService.checkout(req.user.sub, dto);
    }

    @Get('mine')
    findMine(@Req() req) {
        return this.orderService.findMine(req.user.sub);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    findAll(@Query() query: OrderQueryDto) {
        return this.orderService.findAll(query);
    }

    @Get(':id')
    findOne(@Req() req, @Param('id') id: string) {
        return this.orderService.findOne(id, req.user);
    }

    @Patch(':id/cancel')
    cancel(@Req() req, @Param('id') id: string) {
        return this.orderService.cancel(id, req.user.sub);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
        return this.orderService.updateStatus(id, dto);
    }
}
