import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import * as bcrypt from 'bcrypt';
import {sign} from 'jsonwebtoken';
import {UserRepository} from '../repositories/user.repository';
import {UserRole} from '../enums/roles.enum';
import {RolePermissions} from '../config/role-permission.config';

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
      role: UserRole;
    },
  ): Promise<object> {
    const existingUser = await this.userRepository.findOne({
      where: {username: userData.username},
    });

    if (existingUser) {
      throw new HttpErrors.Conflict('Username already exists');
    }

    // Hash the password before saving it
    const hashPwd = await bcrypt.hash(userData.password, 10);
    userData.password = hashPwd;

    // Assign permissions based on user role
    const permissions = RolePermissions[userData.role];

    // Store permissions with user data
    const user = await this.userRepository.create({
      ...userData,
      permissions,
    });

    // Generate JWT token with role and permissions
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions, // Include permissions in token
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

    // Generate JWT token with role and permissions
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions, // Include permissions from the user record
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
