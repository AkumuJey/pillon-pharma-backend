import { UserRole } from 'src/generated/prisma/enums';

export class UserLoginDetails {
  id: string;
  email: string;
  role: UserRole;
}
export class UserProfileDetails {
  name: string;
  id: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
