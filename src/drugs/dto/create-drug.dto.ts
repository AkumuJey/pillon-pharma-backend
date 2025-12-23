import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  brandName: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  genericName?: string;
  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsNumber()
  @IsPositive({ message: 'Selling price must be greater than zero' })
  standardSellingPrice: number;

  @IsBoolean()
  @IsOptional()
  isPrescriptionRequired?: boolean;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
