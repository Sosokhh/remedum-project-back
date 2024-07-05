import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ProductsService } from "../services/products.service";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { ProductDto } from "../dtos/product.dto";

@Controller('products')
export class ProductsController {

  constructor(private productsService: ProductsService) {
  }

  @Get() GetAllProducts(@Paginate() query: PaginateQuery) {
    return this.productsService.getProducts(query);
  }

  @Get(':id')
  async GetProduct(@Param('id') id: number) {
    return await this.productsService.getProduct(id);
  }

  @Post('/add')
  async AddProduct(@Body() data: ProductDto) {
    return await this.productsService.addProduct(data);
  }

  @Put('edit/:id')
  async EditProduct(@Param('id') id: number, @Body() data: ProductDto) {
    return await this.productsService.editProduct(id, data);
  }


  @Delete('remove/:id')
  async DeleteProduct(@Param('id') id: number) {
    return await this.productsService.deleteProduct(id);
  }
}