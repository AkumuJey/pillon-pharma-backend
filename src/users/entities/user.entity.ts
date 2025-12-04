import { UserRole } from '../dto/create-user.dto';

export class User {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
}
