import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryBatchDto {
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @IsDateString()
  expiryDate: string;

  @IsInt()
  @IsPositive()
  quantityReceived: number;

  @IsPositive()
  @Type(() => Number)
  buyingPrice: number;

  @IsPositive()
  @Type(() => Number)
  sellingPriceSnapshot: number;

  @IsString()
  @IsNotEmpty()
  drugId: string;

  @IsOptional()
  @IsString()
  supplierId?: string;
}
