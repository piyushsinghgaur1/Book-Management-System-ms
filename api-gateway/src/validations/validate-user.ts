import {HttpErrors} from '@loopback/rest';
import {
  UserSignInInterface,
  UserSignUpInterface,
} from '../interfaces/user-interface';

export class UserValidator {
  private static instance: UserValidator;

  // Private constructor to prevent instantiation
  private constructor() {}

  // Get instance of the UserValidator class
  public static getInstance(): UserValidator {
    if (!UserValidator.instance) {
      UserValidator.instance = new UserValidator();
    }
    return UserValidator.instance;
  }

  // Validation logic
  public validateSignIn(user: UserSignInInterface): void {
    if (!user.username) {
      throw new HttpErrors.BadRequest('UserName is required');
    }
    if (!user.password) {
      throw new HttpErrors.BadRequest('Password is required');
    }
  }
  public validateSignUp(user: UserSignUpInterface): void {
    if (!user.username) {
      throw new HttpErrors.BadRequest('UserName is required');
    }
    if (!user.password) {
      throw new HttpErrors.BadRequest('Password is required');
    }
    if (!user.email) {
      throw new HttpErrors.BadRequest('Email is required');
    }
    if (!user.firstName) {
      throw new HttpErrors.BadRequest('FirstName is required');
    }
    if (!user.lastName) {
      throw new HttpErrors.BadRequest('LastName is required');
    }
    if (!user.role) {
      throw new HttpErrors.BadRequest('Role is required');
    }
    if (
      user.role !== 'admin' &&
      user.role !== 'user' &&
      user.role !== 'librarian'
    ) {
      throw new HttpErrors.BadRequest(
        'Role must be either admin or user or librarian',
      );
    }
    if (user.password.length < 8) {
      throw new HttpErrors.BadRequest('Password must be at least 8 characters');
    }
    if (user.username.length < 4) {
      throw new HttpErrors.BadRequest('Username must be at least 4 characters');
    }
  }
}
