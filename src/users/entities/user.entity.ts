import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../dto/create-user.dto';

export class User {
  @IsNumber()
  userId: number;
  @IsString()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsOptional()
  phone?: string;
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole;
}
