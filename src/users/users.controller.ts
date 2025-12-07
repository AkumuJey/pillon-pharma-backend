import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create() {
    return this.usersService.create();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne() {
    return this.usersService.findOne();
  }

  @Patch(':id')
  update() {
    return this.usersService.update();
  }
  @Patch(':id/status')
  updateStatus() {
    return this.usersService.update();
  }

  @Delete(':id')
  remove() {
    return this.usersService.remove();
  }
}
