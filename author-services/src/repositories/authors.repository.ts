import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {AuthorPostgresDataSource} from '../datasources';
import {Authors, AuthorsRelations} from '../models';

export class AuthorsRepository extends DefaultCrudRepository<
  Authors,
  typeof Authors.prototype.authorId,
  AuthorsRelations
> {
  constructor(
    @inject('datasources.authorPostgres') dataSource: AuthorPostgresDataSource,
  ) {
    super(Authors, dataSource);
  }
}
