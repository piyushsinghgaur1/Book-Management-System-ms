import {Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';

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
    required: true,
  })
  role: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
