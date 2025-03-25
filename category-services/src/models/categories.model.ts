import {Entity, model, property} from '@loopback/repository';

@model()
export class Categories extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  categoryId: string;

  @property({
    type: 'string',
    required: true,
  })
  categoryName: string;


  constructor(data?: Partial<Categories>) {
    super(data);
  }
}

export interface CategoriesRelations {
  // describe navigational properties here
}

export type CategoriesWithRelations = Categories & CategoriesRelations;
