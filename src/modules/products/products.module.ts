import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "../../entities/product/product.entity";
import { ProductsController } from "./controllers/products.controller";
import { ProductsService } from "./services/products.service";
import { CustomerMiddleware } from "../../utils/middleware/Customer.middleware";
import { JwtService } from "@nestjs/jwt";
import { SalesManagerEntity } from "../../entities/sales-manager/sales-manager.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, SalesManagerEntity])],
  controllers: [ProductsController],
  providers: [ProductsService, JwtService],
})
export class ProductsModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomerMiddleware).forRoutes(ProductsController);
  }
}
