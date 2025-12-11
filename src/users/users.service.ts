import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { UserDetails } from './entities/userDetails.entity';

@Injectable()
export class UsersService {
  constructor(private prismaClient: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    const user = await this.prismaClient.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  async encryptPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  async createUser(data: CreateUserDto): Promise<UserDetails | null> {
    try {
      const { password, email, name, role, phone } = data;
      const hashedPassword = await this.encryptPassword(password);
      const newUser = await this.prismaClient.prisma.user.create({
        data: {
          password: hashedPassword,
          email,
          name,
          role,
          phone,
        },
      });
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
