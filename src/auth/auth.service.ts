import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }
    const passwordValid = await this.usersService.comparePassword(
      password,
      user.password,
    );
    if (!passwordValid) {
      return null;
    }
    return { email: user.email, userId: user.id };
  }
  async authenticate(input: { email: string; password: string }) {
    const user = await this.validateUser(input.email, input.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }
  async login(user: { email: string; userId: string }) {
    const payload = { email: user.email, sub: user.userId };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, ...payload };
  }

  async signUp(data: CreateUserDto) {
    const user = await this.usersService.createUser(data);
    return user;
  }
}
