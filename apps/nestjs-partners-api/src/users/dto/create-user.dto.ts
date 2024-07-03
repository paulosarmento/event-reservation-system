export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: Role;
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PARTNER = 'PARTNER',
}
