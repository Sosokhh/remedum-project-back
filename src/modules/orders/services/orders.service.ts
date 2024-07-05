import { BadRequestException, Injectable } from "@nestjs/common";
import { FilterOperator, paginate, PaginateQuery } from "nestjs-paginate";
import { OrderEntity } from "../../../entities/order/order.entity";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SalesManagerEntity } from "../../../entities/sales-manager/sales-manager.entity";
import { OrderSellDto } from "../dtos/order-sell.dto";
import { ProductEntity } from "../../../entities/product/product.entity";

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource, // For transactions
  ) {
  }


  async getOrders(query: PaginateQuery) {
    return await paginate(query, this.orderRepository, {
      sortableColumns: ["id"],
      nullSort: "last",
      defaultSortBy: [["id", "DESC"]],
      relations: ["product"],
      // select: ['id', 'sales_manager.id']
      filterableColumns: {
        quantity: true,
      }
    });
  }

  async getOrderBySalesManager(query: PaginateQuery, salesManagerId: number) {
    // const queryBuilder = this.orderRepository.createQueryBuilder("order")
    //   .where("order.sales_manager.id = :salesManagerId", { salesManagerId });

    const queryBuilder = this.orderRepository.createQueryBuilder("order")
      .where("order.sales_manager_id = :salesManagerId", { salesManagerId })
      .withDeleted()

    return await paginate(query, queryBuilder, {
      sortableColumns: ["id"],
      nullSort: "last",
      defaultSortBy: [["id", "DESC"]],
      relations: ['product'],
      select: ['id', 'salesManagerId', 'quantity', 'created_at', 'product.id', "product.name", "product.price" ],
      filterableColumns: {
        quantity: true,
      }
    });
  }

  async sellOrder(user: SalesManagerEntity, orderSell: OrderSellDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.findOneByOrFail(ProductEntity, { id: orderSell.productId });

      await this.updateProduct(queryRunner, product, orderSell.quantity);

      const newOrder = this.orderRepository.create({
        sales_manager: user,
        product: product,
        quantity: orderSell.quantity,
        total_price: orderSell.quantity * product.price
      });

      const savedOrder = await queryRunner.manager.save(OrderEntity, newOrder);

      await queryRunner.manager.save(OrderEntity, savedOrder);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateProduct(queryRunner: any, product: ProductEntity, quantity: number) {
    if (product.quantity < quantity) {
      throw new BadRequestException("Insufficient product quantity.");
    } else {
      product.quantity -= quantity;
      await queryRunner.manager.save(ProductEntity, product);
    }
  }
}