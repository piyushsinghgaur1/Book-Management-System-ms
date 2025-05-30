import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgDbDataSource} from '../datasources';
import {User} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(@inject('datasources.pgDB') dataSource: PgDbDataSource) {
    super(User, dataSource);
  }
}
