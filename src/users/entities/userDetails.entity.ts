import { UserRole } from 'src/generated/prisma/enums';

export class UserDetails {
  name: string;
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
