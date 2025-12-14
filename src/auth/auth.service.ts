import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/dto/user-login.dto';
import { SessionService } from 'src/session/session.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionService: SessionService,
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
    return { email: user.email, userId: user.id };
  }
  async authenticate(input: UserLoginDto) {
    const user = await this.validateUser(input.email, input.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }
  async login(user: { email: string; userId: string }) {
    const payload = { email: user.email, sub: user.userId };
    const {
      accessToken,
      refreshToken,
      refreshTokenExpiry: expiresAt,
    } = await this.generateTokens(user.userId, user.email);
    const sessionData = await this.sessionService.createSession(expiresAt, {
      userId: user.userId,
      refreshToken,
    });
    console.log('Session created:', sessionData);
    return { accessToken, ...payload };
  }

  async signUp(data: CreateUserDto) {
    const user = await this.usersService.createUser(data);
    return user;
  }

  async generateTokens(userId: string, email: string) {
    const payload = { email, sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    const refreshTokenExpiry = this.refreshTokenExpiry();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
    return { accessToken, refreshToken, refreshTokenExpiry };
  }
  refreshTokenExpiry(): Date {
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
    return refreshTokenExpiry;
  }
}
