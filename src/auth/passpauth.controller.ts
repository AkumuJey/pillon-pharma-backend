import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';
import { PassportJwtAuthGuard } from '../passport/passport-jwt-guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserLoginDto } from './dto/dto/user-login.dto';

const isProd = process.env.NODE_ENV === 'production';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() body: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.authenticate(body);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    return { user };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const cookies = req.cookies as Record<string, string | undefined>;
      console.log(cookies);
      const refreshToken: string | undefined = cookies?.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(refreshToken);
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
        path: '/', // sent with all requests
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
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
