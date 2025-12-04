import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserRole } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      userId: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+254712345001',
      role: UserRole.MANAGER,
      isActive: false,
    },
    {
      userId: 2,
      name: 'Bob Mwangi',
      email: 'bob.mwangi@example.com',
      phone: '+254712345002',
      role: UserRole.SELLER,
      isActive: false,
    },
    {
      userId: 3,
      name: 'Catherine Njeri',
      email: 'catherine.njeri@example.com',
      phone: '+254712345003',
      role: UserRole.SELLER,
      isActive: false,
    },
    {
      userId: 4,
      name: 'David Otieno',
      email: 'david.otieno@example.com',
      phone: '+254712345004',
      role: UserRole.MANAGER,
      isActive: false,
    },
  ];

  create(createUserDto: CreateUserDto) {
    const newUser: User = {
      userId: this.users.length + 1,
      isActive: false,
      ...createUserDto,
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users[id] || null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.users[id];
    if (!user) return null;
    this.users[id] = { ...user, ...updateUserDto };
    return this.users[id];
  }
  updateStatus(id: number) {
    const user = this.users.find((u) => u.userId === id);
    if (!user) {
      return null;
    }
    user.isActive = !user.isActive; // toggle
    return user;
  }

  remove(id: number) {
    const user = this.users[id];
    if (!user) return null;
    this.users.splice(id, 1);
    return user;
  }
}
