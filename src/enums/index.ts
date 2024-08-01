import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  STAFF = 'staff',
  DIRECTOR = 'director',
}

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

registerEnumType(Role, {
  name: 'Role',
});

registerEnumType(Status, {
  name: 'Status',
});