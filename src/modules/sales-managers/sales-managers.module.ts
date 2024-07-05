import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalesManagerEntity } from "../../entities/sales-manager/sales-manager.entity";
import { CustomerMiddleware } from "../../utils/middleware/Customer.middleware";
import { SalesManagersAuthedController } from "./controllers/sales-managers.authed.controller";
import { SalesManagersController } from "./controllers/sales-managers.controller";
import { SalesManagersService } from "./services/sales-managers.service";
import { JwtService } from "@nestjs/jwt";
import { OrderEntity } from "../../entities/order/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SalesManagerEntity, OrderEntity])],
  controllers: [SalesManagersController, SalesManagersAuthedController],
  providers: [SalesManagersService, JwtService],
})
export class SalesManagersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes(SalesManagersAuthedController);
  }
}
