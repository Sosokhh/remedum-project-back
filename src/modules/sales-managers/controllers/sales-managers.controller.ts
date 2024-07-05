import { Body, Controller, Post } from "@nestjs/common";
import { SalesManagersService } from "../services/sales-managers.service";
import { LoginDto } from "../dtos/login.dto";

@Controller()
export class SalesManagersController {

  constructor(private salesManagersService: SalesManagersService) {}

  @Post('login')
  async CustomerLogin(@Body() data: LoginDto) {
    return this.salesManagersService.loginSalesManager(data);
  }

}