import {authenticate} from 'loopback4-authentication';
// import {authorize} from '@loopback/authorization';
import {Filter, repository} from '@loopback/repository';
import {get, HttpErrors, param} from '@loopback/rest';
import {STRATEGY} from 'loopback4-authentication';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    // @inject.getter(AuthenticationBindings.CURRENT_USER)
    // private readonly getCurrentUser: Getter<User>,
  ) {}

  @authenticate(STRATEGY.BEARER)
  // @authorize({allowedRoles: ['admin']})
  @get('/users')
  async find(
    @param.query.object('filter') filter?: Filter<User>,
  ): Promise<User[]> {
    console.log('from users', filter);
    return this.userRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @get('/me')
  async getCurrentUser(): Promise<User> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new HttpErrors.Unauthorized('No authenticated user found');
    }
    return user;
  }
}
