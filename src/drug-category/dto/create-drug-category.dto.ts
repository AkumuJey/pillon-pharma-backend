import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDrugCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}
