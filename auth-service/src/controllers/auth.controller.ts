import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import * as bcrypt from 'bcrypt';
import {sign} from 'jsonwebtoken';
import {UserRepository} from '../repositories/user.repository';

export class AuthController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/signup')
  async signup(
    @requestBody()
    userData: {
      username: string;
      password: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    },
  ): Promise<{token: string}> {
    const existingUser = await this.userRepository.findOne({
      where: {username: userData.username},
    });

    if (existingUser) {
      throw new HttpErrors.Conflict('Username already exists');
    }
    const hashPwd = await bcrypt.hash(userData.password, 10);
    userData.password = hashPwd;
    const user = await this.userRepository.create(userData);
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET || 'mysecretkey123',
      {
        expiresIn: '1h',
        issuer: process.env.JWT_ISSUER || 'app',
      },
    );

    return {token};
  }

  @post('/login')
  async login(
    @requestBody() credentials: {username: string; password: string},
  ): Promise<{token: string}> {
    const user = await this.userRepository.findOne({
      where: {username: credentials.username},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    // Generate JWT token
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      process.env.JWT_SECRET || 'mysecretkey123',
      {
        expiresIn: '1h',
        issuer: process.env.JWT_ISSUER || 'app',
      },
    );

    return {token};
  }
}
