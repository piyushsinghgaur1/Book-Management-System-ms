import {expect} from 'chai';
import * as sinon from 'sinon';
import {BookController} from '../../controllers';
import {BookRepository} from '../../repositories';
import {Book} from '../../models';
import {Count} from '@loopback/repository';

describe('BookController', () => {
  let bookController: BookController;
  let bookRepositoryStub: sinon.SinonStubbedInstance<BookRepository>;

  beforeEach(() => {
    // Create a stub for the BookRepository
    bookRepositoryStub = sinon.createStubInstance(
      BookRepository,
    ) as sinon.SinonStubbedInstance<BookRepository>;

    // Initialize the controller with the stubbed repository
    bookController = new BookController(bookRepositoryStub);
  });

  it('should create a new book', async () => {
    const newBook = new Book({
      bookId: 'B1',
      title: 'Title 1',
      isbn: '6758321574',
      price: '2322',
      discountPercentage: 10,
      authorId: 'A1',
      categoryId: 'C1',
      discription: 'Best Book',
    });

    // Stub the 'create' method
    bookRepositoryStub.create.resolves(newBook);

    const result = await bookController.create(newBook);

    expect(result).to.eql(newBook); // Check if the returned result is as expected
    sinon.assert.calledOnce(bookRepositoryStub.create);
  });

  it('should return count of books', async () => {
    const count: Count = {count: 15};
    bookRepositoryStub.count.resolves(count);

    const result = await bookController.count();

    expect(result).to.eql(count); // Checking the result matches the expected count
    sinon.assert.calledOnce(bookRepositoryStub.count);
  });

  it('should return all books', async () => {
    const booksArray = [
      new Book({
        bookId: 'B1',
        title: 'Title 1',
        isbn: '6758321574',
        price: '2322',
        discountPercentage: 10,
        authorId: 'A1',
        categoryId: 'C1',
        discription: 'Best Book',
      }),
      new Book({
        bookId: 'B2',
        title: 'Title 2',
        isbn: '6758321575',
        price: '3000',
        discountPercentage: 15,
        authorId: 'A2',
        categoryId: 'C2',
        discription: 'Another Best Book',
      }),
    ];
    // Stub the 'find' method
    bookRepositoryStub.find.resolves(booksArray);

    const result = await bookController.find();

    expect(result).to.eql(booksArray); // Checks if the books returned are correct
    sinon.assert.calledOnce(bookRepositoryStub.find);
  });

  it('should update books', async () => {
    const count: Count = {count: 3};
    bookRepositoryStub.updateAll.resolves(count);

    const result = await bookController.updateAll(
      new Book({
        bookId: 'B1',
        title: 'Updated Title',
        isbn: '6758321574',
        price: '2400',
        discountPercentage: 12,
        authorId: 'A1',
        categoryId: 'C1',
        discription: 'Updated Best Book',
      }),
    );

    expect(result).to.eql(count);
    sinon.assert.calledOnce(bookRepositoryStub.updateAll);
  });

  it('should find a book by id', async () => {
    const bookId = 'B1';
    const book = new Book({
      bookId: bookId,
      title: 'Title 1',
      isbn: '6758321574',
      price: '2322',
      discountPercentage: 10,
      authorId: 'A1',
      categoryId: 'C1',
      discription: 'Best Book',
    });

    // Stub 'findById' method
    bookRepositoryStub.findById.resolves(book);

    const result = await bookController.findById(bookId);

    expect(result).to.eql(book); // Checking the found book matches the expected one
    sinon.assert.calledOnce(bookRepositoryStub.findById);
  });

  it('should update a book by id', async () => {
    const bookId = 'B1';
    const updatedBook = new Book({
      bookId: 'B1',
      title: 'Updated Title',
      isbn: '6758321574',
      price: '2400',
      discountPercentage: 12,
      authorId: 'A1',
      categoryId: 'C1',
      discription: 'Updated Best Book',
    });

    // Stub 'updateById' method
    bookRepositoryStub.updateById.resolves();

    await bookController.updateById(bookId, updatedBook);

    sinon.assert.calledOnce(bookRepositoryStub.updateById);
  });

  it('should replace a book by id', async () => {
    const bookId = 'B1';
    const replacedBook = new Book({
      bookId: 'B1',
      title: 'Replaced Title',
      isbn: '6758321574',
      price: '2500',
      discountPercentage: 15,
      authorId: 'A1',
      categoryId: 'C1',
      discription: 'Replaced Best Book',
    });

    // Stub 'replaceById' method
    bookRepositoryStub.replaceById.resolves();

    await bookController.replaceById(bookId, replacedBook);

    sinon.assert.calledOnce(bookRepositoryStub.replaceById);
  });

  it('should delete a book by id', async () => {
    const bookId = 'B1';
    // Stub 'deleteById' method
    bookRepositoryStub.deleteById.resolves();

    await bookController.deleteById(bookId);

    sinon.assert.calledOnce(bookRepositoryStub.deleteById);
  });
});
