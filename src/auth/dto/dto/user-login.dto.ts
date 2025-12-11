import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserLoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  password: string;
}
