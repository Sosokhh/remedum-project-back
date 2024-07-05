import { IsNotEmpty, IsNumber } from "class-validator";

export class ProductDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
