import { IsNotEmpty, IsNumber } from "class-validator";

export class OrderSellDto {
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  quantity: number;
}
