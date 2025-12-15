import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  jti: string;
  @IsDate()
  expiresAt: Date;
}
