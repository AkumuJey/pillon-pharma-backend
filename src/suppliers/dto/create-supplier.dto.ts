import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  contactPerson?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;
}
