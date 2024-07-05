import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ProductsModule } from "./modules/products/products.module";
import { SalesManagersModule } from "./modules/sales-managers/sales-managers.module";
import { OrdersModule } from "./modules/orders/orders.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD ,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: false,
      ssl: true,
      logging: false,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      },
    }),
    ProductsModule,
    OrdersModule,
    SalesManagersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
