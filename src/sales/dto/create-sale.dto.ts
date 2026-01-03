import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from 'src/generated/prisma/enums';

export class CreateSaleItemDto {
  @IsInt()
  @IsPositive()
  quantiy: number;
  @IsString()
  @IsNotEmpty()
  drugId: string;
}

export class CreateSaleDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];
}
