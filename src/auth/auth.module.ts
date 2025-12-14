import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from '../config/constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from '../strategy/local.strategy';

import { AuthController } from './passpauth.controller';
import { JwtStrategy } from '../strategy/jwt-strategy';
import { SessionService } from 'src/session/session.service';
import { SessionModule } from 'src/session/session.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from './token.service';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionService,
    PrismaService,
    TokenService,
  ],
})
export class AuthModule {}
