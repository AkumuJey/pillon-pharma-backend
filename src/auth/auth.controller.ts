import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PassportJwtAuthGuard } from '../passport/passport-jwt-guard';
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
    const user = await this.authService.signIn(res, body);
    return user;
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.refreshTokens(req, res);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('It got here');
    await this.authService.signOut(req, res);
    return { message: 'Successful logout' };
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
  @Delete()
  deleteAllSessions() {
    return this.authService.deleteAllSessions();
  }
  @Get('/sessions')
  async getAllSession() {
    console.log('Geting sessions');
    const results = await this.authService.getAllTokens();
    console.log(results);
    return results;
  }
}
