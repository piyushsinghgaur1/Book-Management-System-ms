import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {sign} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {AuthController} from '../../controllers';
import {UserRepository} from '../../repositories';
import {User} from '../../models';
import {UserRole} from '../../enums/roles.enum';
import jwt from 'jsonwebtoken';
import {Permission} from '../../enums/permissions.enum';
describe('AuthControllerTesting', () => {
  let authController: AuthController;
  let userRepositoryStub: sinon.SinonStubbedInstance<UserRepository>;
  beforeEach(() => {
    userRepositoryStub = sinon.createStubInstance(
      UserRepository,
    ) as sinon.SinonStubbedInstance<UserRepository>;
    authController = new AuthController(userRepositoryStub);
  });

  it('should return a token for successfully login with valid credentials', async () => {
    const user = new User({
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: UserRole.ADMIN,
    });

    const credentials = {
      username: 'testuser',
      password: 'testpassword',
    };

    userRepositoryStub.findOne.resolves(user);
    sinon.stub(bcrypt, 'compare').resolves(true);
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
        issuer: process.env.JWT_ISSUER,
      },
    );

    const result = await authController.login(credentials);

    expect(result.token).to.equal(token);
    sinon.assert.calledOnce(userRepositoryStub.findOne);
  });

  it('should return a token for successful signup', async () => {
    const userData = new User({
      username: 'newuser',
      email: 'new@example.com',
      password: 'plaintextpassword',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.ADMIN,
      permissions: [Permission.DELETE_BOOK],
    });

    const hashPassword = 'hashedPassword';

    userRepositoryStub.findOne.resolves(null);
    sinon.stub(bcrypt, 'hash').resolves(hashPassword);

    const createdUser = new User({
      ...userData,
      password: hashPassword,
      id: 123,
      permissions: [Permission.DELETE_BOOK],
    });

    userRepositoryStub.create.resolves(createdUser);

    const fakeToken = 'stubbed-token';
    sinon.stub(jwt, 'sign').callsFake(() => fakeToken);

    const result = await authController.signup(userData);
    expect((result as {token: string}).token).to.equal(fakeToken);
    sinon.assert.calledOnce(userRepositoryStub.create);
  });
});
