import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {BookDbDataSource} from '../datasources';
import {Book, BookRelations} from '../models';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.bookId,
  BookRelations
> {
  constructor(
    @inject('datasources.bookDB') dataSource: BookDbDataSource,
  ) {
    super(Book, dataSource);
  }
}
