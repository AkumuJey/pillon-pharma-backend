import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { StockMovementType } from 'src/generated/prisma/enums';

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

export class receiveStockDto {
  @IsString()
  drugId: string;
  @IsString()
  batchNumber: string;
  @IsInt()
  @IsPositive()
  quantityReceived: number;
  @IsString()
  expiryDate: string;
  @IsPositive()
  buyingPrice: number;
  @IsPositive()
  sellingPriceSnapshot: number;
  @IsString()
  @IsOptional()
  supplierId?: string;
}

export class AdjustStockDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
  @IsString()
  @IsNotEmpty()
  inventoryBatchId: string;
  @IsInt()
  @IsPositive()
  quantity: number;
  @IsEnum(StockMovementType, { message: 'Invalid adjustment' })
  movementType: StockMovementType;
}
