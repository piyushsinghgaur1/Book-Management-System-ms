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
import {Authors} from '../models';
import {AuthorsRepository} from '../repositories';

export class AuthorController {
  constructor(
    @repository(AuthorsRepository)
    public authorsRepository : AuthorsRepository,
  ) {}

  @post('/authors')
  @response(200, {
    description: 'Authors model instance',
    content: {'application/json': {schema: getModelSchemaRef(Authors)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Authors, {
            title: 'NewAuthors',
            
          }),
        },
      },
    })
    authors: Authors,
  ): Promise<Authors> {
    return this.authorsRepository.create(authors);
  }

  @get('/authors/count')
  @response(200, {
    description: 'Authors model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Authors) where?: Where<Authors>,
  ): Promise<Count> {
    return this.authorsRepository.count(where);
  }

  @get('/authors')
  @response(200, {
    description: 'Array of Authors model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Authors, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Authors) filter?: Filter<Authors>,
  ): Promise<Authors[]> {
    return this.authorsRepository.find(filter);
  }

  @patch('/authors')
  @response(200, {
    description: 'Authors PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Authors, {partial: true}),
        },
      },
    })
    authors: Authors,
    @param.where(Authors) where?: Where<Authors>,
  ): Promise<Count> {
    return this.authorsRepository.updateAll(authors, where);
  }

  @get('/authors/{id}')
  @response(200, {
    description: 'Authors model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Authors, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Authors, {exclude: 'where'}) filter?: FilterExcludingWhere<Authors>
  ): Promise<Authors> {
    return this.authorsRepository.findById(id, filter);
  }

  @patch('/authors/{id}')
  @response(204, {
    description: 'Authors PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Authors, {partial: true}),
        },
      },
    })
    authors: Authors,
  ): Promise<void> {
    await this.authorsRepository.updateById(id, authors);
  }

  @put('/authors/{id}')
  @response(204, {
    description: 'Authors PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() authors: Authors,
  ): Promise<void> {
    await this.authorsRepository.replaceById(id, authors);
  }

  @del('/authors/{id}')
  @response(204, {
    description: 'Authors DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.authorsRepository.deleteById(id);
  }
}
