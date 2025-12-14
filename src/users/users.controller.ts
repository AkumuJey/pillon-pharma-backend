import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UserRole } from 'src/generated/prisma/enums';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    const users = await this.usersService.getAllUsers();
    const count = await this.usersService.countUsers();
    return { count, users };
  }
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    return user;
  }
  @Put(':id')
  async updateUserDetails(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    return updatedUser;
  }
  @Put(':id/role')
  async updateUserRole(@Param('id') id: string, @Body('role') role: UserRole) {
    const updatedUser = await this.usersService.updateUserRole(id, role);
    return updatedUser;
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.deleteUser(id);
    return deletedUser;
  }
}
