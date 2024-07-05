import { IsNotEmpty, IsOptional } from "class-validator";

export class SalesManagerEditDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  password?: string;
}
