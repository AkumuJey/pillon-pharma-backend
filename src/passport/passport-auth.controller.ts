import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { PassportJwtAuthGuard } from './passport-jwt-guard';

interface LoginUser {
  username: string;
  userId: number;
}

@Controller('auth')
export class PassportAuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user as LoginUser);
  }
  @Get('profile')
  @UseGuards(PassportJwtAuthGuard)
  getProfile(@Req() request: Request) {
    return request.user;
  }
}
