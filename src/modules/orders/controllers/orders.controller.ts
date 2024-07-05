import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { OrdersService } from "../services/orders.service";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { OrderSellDto } from "../dtos/order-sell.dto";
import { SalesManagerEntity } from "../../../entities/sales-manager/sales-manager.entity";

@Controller('orders')
export class OrdersController {

  constructor(private ordersService: OrdersService) {
  }

  @Get() GetAllOrders(@Paginate() query: PaginateQuery) {
    return this.ordersService.getOrders(query);
  }

  @Get(':sales_manager_id') GetOrderBySalesManager(@Paginate() query: PaginateQuery, @Param('sales_manager_id') salesManagerId: number) {
    return this.ordersService.getOrderBySalesManager(query, salesManagerId);
  }

  @Post('sell') SellOrder(@Req() req: Request, @Body() orderSell: OrderSellDto) {
    const user: SalesManagerEntity = req['user'];
    return this.ordersService.sellOrder(user, orderSell)
  }
}