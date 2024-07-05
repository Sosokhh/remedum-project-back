import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SalesManagerEntity } from "../../../entities/sales-manager/sales-manager.entity";
import { LoginDto } from "../dtos/login.dto";
import { compareHash, hashString } from "../../../utils/functions/jwtHash";
import { CustomBadRequestException, successResponse } from "../../../utils/functions/response.util";
import { JwtService } from "@nestjs/jwt";
import { SalesManagerDto } from "../dtos/sales-manager.dto";
import { FilterOperator, paginate, PaginateQuery } from "nestjs-paginate";
import { SalesManagerEditDto } from "../dtos/sales-manager-edit.dto";

@Injectable()
export class SalesManagersService {

  constructor(
    @InjectRepository(SalesManagerEntity)
    private salesManagerRepository: Repository<SalesManagerEntity>,
    private jwtService: JwtService
  ) {
  }

  async loginSalesManager(data?: LoginDto) {
    const salesManager = await this.salesManagerRepository.findOneBy({
      username: data.username
    });
    if (salesManager && (await compareHash(data.password, salesManager.password))) {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            username: salesManager.username,
            id: salesManager.id
          },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: "1d"
          }
        ),
        this.jwtService.signAsync(
          {
            username: salesManager.username,
            id: salesManager.id
          },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: "7d"
          }
        )
      ]);

      return {
        accessToken,
        refreshToken,
      };

    } else {
      throw new CustomBadRequestException({
        username: "Incorrect data",
        password: "Incorrect data"
      });
    }
  }

  async createSalesManager(data: SalesManagerDto) {
    const newSalesManager = this.salesManagerRepository.create({
      ...data,
      password: await hashString(data.password)
    });

    await this.salesManagerRepository.save(newSalesManager);
    return successResponse();
  }


  async getSalesManagers(query: PaginateQuery) {
    // const queryBuilder = this.salesManagerRepository.createQueryBuilder('salesManager')
    // .leftJoin('salesManager.orderSalesManagers', 'orderSalesManagers')
    // .leftJoin('orderSalesManagers.order', 'order')
    // .leftJoin('order.order_items', 'order_items')
    // .select([
    //   'salesManager.id as salesManagerId',
    //   'orderSalesManagers.id as orderSalesManagerId',
    //   'order.id as orderId',public
    //   'order_items.id as orderItemId',
    //   'order_items.fullPrice as fullPrice',
    // ]);
    // .orderBy('salesManager.id', 'DESC');

    // const queryBuilder = this.orderRepository.createQueryBuilder('sales_managers')
    //     .leftJoin('sales_managers.orderSalesManagers', 'orderSalesManagers')
    //     .leftJoin('orderSalesManagers.order', 'order')
    //     .leftJoin('order.order_items', 'order_items')
    //     .select('sales_managers.id', 'id')
    //     .addSelect('sales_managers.first_name', 'firstName')
    //     .addSelect('sales_managers.last_name', 'lastName')
    //     .addSelect('SUM(order_items.unitPrice * order_items.quantity)', 'totalPurchaseMoney')
    //     .groupBy('id');


    return await paginate(query, this.salesManagerRepository, {
      sortableColumns: ["id"],
      defaultSortBy: [["id", "DESC"]],
      searchableColumns: ['firstName', 'username', 'lastName', 'created_at'],
      relations: ['orders'],
      filterableColumns: {
        username: [FilterOperator.CONTAINS],
        firstName: [FilterOperator.CONTAINS],
        lastName: [FilterOperator.CONTAINS],
        created_at: [FilterOperator.BTW],
      }
    });
  }
  async getSalesManager(id: number) {
    return await this.salesManagerRepository.findOne({
      select: ['id', 'username', 'firstName', 'lastName'],
      where: { id },
    });
  }

  async editSalesManager(id: number, data: SalesManagerEditDto) {
    const user = await this.salesManagerRepository.findOneByOrFail({ id });

    let newPassword = user.password;

    if (data.password) {
      newPassword = await hashString(data.password);
    }

    await this.salesManagerRepository.update(id,{
      ...data,
      password: newPassword
    });

    return;
  }


  async deleteSalesManager(id: number) {
    return await this.salesManagerRepository.delete(id);
  }

  async getToken(req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const data = this.jwtService.decode(token);

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          {
            username: data.username,
            id: data.id,
          },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: '1d',
          },
        ),
        this.jwtService.signAsync(
          {
            username: data.username,
            id: data.id,
          },
          {
            secret: process.env.JWT_SECRET,
            expiresIn: '7d',
          },
        ),
      ]);

      return {
        accessToken,
        refreshToken,

    }
  }
}