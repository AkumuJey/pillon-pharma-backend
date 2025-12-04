import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export enum UserRole {
  MANAGER = 'MANAGER',
  SELLER = 'SELLER',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(UserRole, { message: 'Role must be MANAGER or SELLER' })
  role: UserRole;
}
