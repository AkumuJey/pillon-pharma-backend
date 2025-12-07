import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor() {}

  create() {
    return 'Hello Akumu';
  }

  findAll() {
    return 'Hello Akumu';
  }

  findOne() {}

  update() {}
  remove() {}
}
