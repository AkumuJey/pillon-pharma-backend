import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  validateUser(username: string, pass: string) {
    const user = this.usersService.findOne(username);
    if (user && user.password === pass) {
      return {
        username: user.username,
        userId: user.userId,
      };
    }
    return null;
  }
  authenticate(input: { username: string; password: string }) {
    const user = this.validateUser(input.username, input.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }
  async login(user: { username: string; userId: number }) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, ...payload };
  }
}
