import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product/product.entity";
import { OrdersController } from "./controllers/orders.controller";
import { OrdersService } from "./services/orders.service";
import { CustomerMiddleware } from "../../utils/middleware/Customer.middleware";
import { OrderEntity } from "../../entities/order/order.entity";
import { JwtService } from "@nestjs/jwt";
import { SalesManagerEntity } from "../../entities/sales-manager/sales-manager.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, OrderEntity, SalesManagerEntity])],
  controllers: [OrdersController],
  providers: [OrdersService, JwtService],
})
export class OrdersModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes(OrdersController);
  }
}
