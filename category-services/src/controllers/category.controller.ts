import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Categories} from '../models';
import {CategoriesRepository} from '../repositories';

export class CategoryController {
  constructor(
    @repository(CategoriesRepository)
    public categoriesRepository : CategoriesRepository,
  ) {}

  @post('/categories')
  @response(200, {
    description: 'Categories model instance',
    content: {'application/json': {schema: getModelSchemaRef(Categories)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categories, {
            title: 'NewCategories',
            
          }),
        },
      },
    })
    categories: Categories,
  ): Promise<Categories> {
    return this.categoriesRepository.create(categories);
  }

  @get('/categories/count')
  @response(200, {
    description: 'Categories model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Categories) where?: Where<Categories>,
  ): Promise<Count> {
    return this.categoriesRepository.count(where);
  }

  @get('/categories')
  @response(200, {
    description: 'Array of Categories model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Categories, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Categories) filter?: Filter<Categories>,
  ): Promise<Categories[]> {
    return this.categoriesRepository.find(filter);
  }

  @patch('/categories')
  @response(200, {
    description: 'Categories PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categories, {partial: true}),
        },
      },
    })
    categories: Categories,
    @param.where(Categories) where?: Where<Categories>,
  ): Promise<Count> {
    return this.categoriesRepository.updateAll(categories, where);
  }

  @get('/categories/{id}')
  @response(200, {
    description: 'Categories model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Categories, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Categories, {exclude: 'where'}) filter?: FilterExcludingWhere<Categories>
  ): Promise<Categories> {
    return this.categoriesRepository.findById(id, filter);
  }

  @patch('/categories/{id}')
  @response(204, {
    description: 'Categories PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Categories, {partial: true}),
        },
      },
    })
    categories: Categories,
  ): Promise<void> {
    await this.categoriesRepository.updateById(id, categories);
  }

  @put('/categories/{id}')
  @response(204, {
    description: 'Categories PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() categories: Categories,
  ): Promise<void> {
    await this.categoriesRepository.replaceById(id, categories);
  }

  @del('/categories/{id}')
  @response(204, {
    description: 'Categories DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.categoriesRepository.deleteById(id);
  }
}
