import { Body, Controller, Delete, Get, Param, Post, Put, Req } from "@nestjs/common";
import { SalesManagersService } from "../services/sales-managers.service";
import { SalesManagerDto } from "../dtos/sales-manager.dto";
import { Paginate, PaginateQuery } from "nestjs-paginate";
import { ProductDto } from "../../products/dtos/product.dto";
import { SalesManagerEditDto } from "../dtos/sales-manager-edit.dto";

@Controller('sales-managers')
export class SalesManagersAuthedController {

  constructor(private salesManagersService: SalesManagersService) {}

  @Post('register')
  async CreateCustomer(@Body() data: SalesManagerDto) {
    return await this.salesManagersService.createSalesManager(data);
  }

  @Post('refresh-token')
  async getToken(@Req() req: Request) {
    return await this.salesManagersService.getToken(req)
  }

  @Get() GetSalesManagers(@Paginate() query: PaginateQuery) {
    return this.salesManagersService.getSalesManagers(query);
  }

  @Get(':id')
  async GetSalesManager(@Param('id') id: number) {
    return await this.salesManagersService.getSalesManager(id);
  }

  @Put('edit/:id')
  async Update(@Param('id') id: number, @Body() data: SalesManagerEditDto) {
    return await this.salesManagersService.editSalesManager(id, data);
  }


  @Delete('remove/:id')
  async Destroy(@Param('id') id: number) {
    return await this.salesManagersService.deleteSalesManager(id);
  }


}