import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './dto/dto/user-login.dto';
import { TokenService } from './token.service';

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
    const { accessToken, refreshToken, newSessionData } =
      await this.tokenService.generateTokens(user.userId, user.email);

    return { accessToken, refreshToken, newSessionData };
  }

  async signUp(data: CreateUserDto) {
    const user = await this.usersService.createUser(data);
    return user;
  }
}
