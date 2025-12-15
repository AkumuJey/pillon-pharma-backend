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
    this.authService.attachTokensToCookies(accessToken, refreshToken, res);
    return { user };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const cookies = req.cookies as Record<string, string | undefined>;
      const refreshToken: string | undefined = cookies?.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token provided');
      }
      const { accessToken, refreshToken: newRefreshToken } =
        await this.authService.refreshTokens(refreshToken);
      this.authService.attachTokensToCookies(accessToken, newRefreshToken, res);
      return { accessToken: newRefreshToken };
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
