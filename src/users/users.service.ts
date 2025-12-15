import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { UserProfileDetails } from './entities/userDetails.entity';
import { UpdateUserDto } from './dto/update-user.dto';

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
  async createUser(data: CreateUserDto): Promise<UserProfileDetails | null> {
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

  async getAllUsers(): Promise<UserProfileDetails[]> {
    const users = await this.prismaClient.prisma.user.findMany();
    return users.map(({ password, ...user }) => user);
  }
  async countUsers(): Promise<number> {
    return this.prismaClient.prisma.user.count();
  }
  async getUserById(id: string): Promise<UserProfileDetails | null> {
    const user = await this.prismaClient.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async deleteUser(id: string): Promise<void> {
    await this.prismaClient.prisma.user.delete({
      where: { id },
    });
  }
  async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<UserProfileDetails | null> {
    if (updateData.password) {
      updateData.password = await this.encryptPassword(updateData.password);
    }

    const updatedUser = await this.prismaClient.prisma.user.update({
      where: { id },
      data: updateData,
    });
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
  async updateUserRole(
    id: string,
    role: UserRole,
  ): Promise<UserProfileDetails | null> {
    const updatedUser = await this.prismaClient.prisma.user.update({
      where: { id },
      data: { role },
    });
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
