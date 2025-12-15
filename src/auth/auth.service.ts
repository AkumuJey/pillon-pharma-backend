import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/dto/user-login.dto';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { UserLoginDetails } from 'src/users/entities/userDetails.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await this.usersService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async authenticate(input: UserLoginDto) {
    const user = await this.validateUser(input.email, input.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return await this.tokenizeLogin(user);
  }
  attachTokensToCookies(
    accessToken: string,
    refreshToken: string,
    res: Response,
    refreshAge?: number,
  ) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: refreshAge ? refreshAge : 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
    });
  }
  async tokenizeLogin(user: UserLoginDetails) {
    const results = await this.tokenService.generateTokens(user.id, user.email);
    return { user, ...results };
  }

  async signIn(res: Response, body: UserLoginDto): Promise<UserLoginDetails> {
    const { accessToken, refreshToken, user } = await this.authenticate(body);
    this.attachTokensToCookies(accessToken, refreshToken, res);
    return user;
  }

  async signOut(req: Request, res: Response) {
    const cookies = req.cookies as Record<string, string | undefined>;
    const refreshToken: string | undefined = cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    const { jti } = await this.tokenService.validateRefreshToken(refreshToken);
    if (!jti) throw new UnauthorizedException('Invalid Token');
    await this.tokenService.invalidateRefreshToken(jti);
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('accessToken', { path: '/' });
  }
  async deleteAllSessions() {
    return await this.tokenService.deleteAllSessions();
  }
  async signUp(data: CreateUserDto) {
    return await this.usersService.createUser(data);
  }

  async refreshTokens(req: Request, res: Response) {
    const cookies = req.cookies as Record<string, string | undefined>;
    const refreshToken: string | undefined = cookies?.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token provided');
    }
    const tokens = await this.tokenService.refreshTokens(refreshToken);
    const refreshAge = tokens.expiresAt.getTime() - Date.now();
    this.attachTokensToCookies(
      tokens.accessToken,
      tokens.refreshToken,
      res,
      refreshAge,
    );
  }

  async getAllTokens() {
    return await this.tokenService.getAllSessions();
  }
}
