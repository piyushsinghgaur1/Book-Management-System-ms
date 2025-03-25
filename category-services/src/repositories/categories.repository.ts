import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CategoryDbDataSource} from '../datasources';
import {Categories, CategoriesRelations} from '../models';

export class CategoriesRepository extends DefaultCrudRepository<
  Categories,
  typeof Categories.prototype.categoryId,
  CategoriesRelations
> {
  constructor(
    @inject('datasources.categoryDB') dataSource: CategoryDbDataSource,
  ) {
    super(Categories, dataSource);
  }
}
