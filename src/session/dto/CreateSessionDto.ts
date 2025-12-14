import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: string;
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
  @IsString()
  @IsOptional()
  ipAddress?: string;
  @IsString()
  @IsOptional()
  userAgent?: string;
}
