import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { PassportJwtAuthGuard } from '../passport/passport-jwt-guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserLoginDto } from './dto/dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.authService.authenticate(body);
  }
  @Post('sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }
  @Get('profile')
  @UseGuards(PassportJwtAuthGuard)
  getProfile(@Req() request: Request) {
    return request.user;
  }
}
