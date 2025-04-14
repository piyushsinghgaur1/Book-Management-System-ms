import {expect} from 'chai';
import * as sinon from 'sinon';
import {AuthorController} from '../../controllers';
import {AuthorsRepository} from '../../repositories';
import {Authors} from '../../models';
import {Count} from '@loopback/repository';

describe('AuthorController', () => {
  let authorController: AuthorController;
  let authorsRepositoryStub: sinon.SinonStubbedInstance<AuthorsRepository>;

  beforeEach(() => {
    authorsRepositoryStub = sinon.createStubInstance(
      AuthorsRepository,
    ) as sinon.SinonStubbedInstance<AuthorsRepository>;

    // Initialize the controller with the stubbed repository
    authorController = new AuthorController(authorsRepositoryStub);
  });

  it('should create a new author', async () => {
    const newAuthor = new Authors({authorName: 'New Author'});
    authorsRepositoryStub.create.resolves(newAuthor); // Stub the 'create' method

    const result = await authorController.create(newAuthor);

    expect(result).to.eql(newAuthor); // Check if the returned result is as expected
    sinon.assert.calledOnce(authorsRepositoryStub.create);
  });

  it('should return count of authors', async () => {
    const count: Count = {count: 10};
    authorsRepositoryStub.count.resolves(count);

    const result = await authorController.count();

    expect(result).to.eql(count); // Checking the result matches the expected count
    sinon.assert.calledOnce(authorsRepositoryStub.count);
  });

  it('should return all authors', async () => {
    const authorsArray = [
      new Authors({authorName: 'Author 1'}),
      new Authors({authorName: 'Author 2'}),
    ];
    authorsRepositoryStub.find.resolves(authorsArray); // Stub the 'find' method

    const result = await authorController.find();

    expect(result).to.eql(authorsArray); // Checks if the authors returned are correct
    sinon.assert.calledOnce(authorsRepositoryStub.find);
  });

  it('should update authors', async () => {
    const count: Count = {count: 2};
    authorsRepositoryStub.updateAll.resolves(count); // 'updateAll' method

    const result = await authorController.updateAll(
      new Authors({authorName: 'Updated Author'}),
    );

    // Use Chai's expect for assertion
    expect(result).to.eql(count);
    sinon.assert.calledOnce(authorsRepositoryStub.updateAll);
  });

  it('should find an author by id', async () => {
    const authorId = '1';
    const author = new Authors({authorId: authorId, authorName: 'Author 1'});
    authorsRepositoryStub.findById.resolves(author); // Stub 'findById' method

    const result = await authorController.findById(authorId);

    expect(result).to.eql(author); // Ensure the found author matches the expected one
    sinon.assert.calledOnce(authorsRepositoryStub.findById);
  });

  it('should update an author by id', async () => {
    const authorId = '1';
    const updatedAuthor = new Authors({authorName: 'Updated Author'});
    authorsRepositoryStub.updateById.resolves(); // Stub 'updateById' method

    await authorController.updateById(authorId, updatedAuthor);

    sinon.assert.calledOnce(authorsRepositoryStub.updateById);
  });

  it('should replace an author by id', async () => {
    const authorId = '1';
    const replacedAuthor = new Authors({authorName: 'Replaced Author'});
    authorsRepositoryStub.replaceById.resolves(); // Stub 'replaceById' method

    await authorController.replaceById(authorId, replacedAuthor);

    sinon.assert.calledOnce(authorsRepositoryStub.replaceById);
  });

  it('should delete an author by id', async () => {
    const authorId = '1';
    authorsRepositoryStub.deleteById.resolves(); // Stub 'deleteById' method

    await authorController.deleteById(authorId);

    sinon.assert.calledOnce(authorsRepositoryStub.deleteById);
  });
});
