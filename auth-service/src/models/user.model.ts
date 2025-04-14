import {Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';
import {UserRole} from '../enums/roles.enum';
import {Permission} from '../enums/permissions.enum';

@model({name: 'users'})
export class User extends Entity implements IAuthUser {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
    name: 'first_name',
  })
  firstName?: string;

  @property({
    type: 'string',
    name: 'last_name',
  })
  lastName?: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: Object.values(UserRole),
    },
  })
  role: UserRole;

  @property({
    type: 'array',
    itemType: 'string',
    jsonSchema: {
      enum: Object.values(Permission),
    },
  })
  permissions: Permission[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
