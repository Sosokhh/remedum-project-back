import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "../../../entities/product/product.entity";
import { Repository } from "typeorm";
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from "nestjs-paginate";
import { ProductDto } from "../dtos/product.dto";

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async getProducts(query: PaginateQuery) {

    return await paginate(query, this.productRepository, {
      sortableColumns: ['id'],
      nullSort: 'last',
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        name: [FilterOperator.CONTAINS, FilterSuffix.NOT],
      }
    });
  }

  async getProduct(id: number) {
    return await this.productRepository.findOneByOrFail({ id });
  }

  async addProduct(data: ProductDto) {
    const newProduct = this.productRepository.create(data);
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async editProduct(id: number, data: ProductDto) {
    await this.productRepository.findOneByOrFail({ id });
    await this.productRepository.update(id, { ...data });
    return ;
  }

  async deleteProduct(id: number) {
    return await this.productRepository.softDelete(id);
  }

}