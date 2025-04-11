import {Client, createRestAppClient, expect} from '@loopback/testlab';
import sinon from 'sinon';
import axios from 'axios';
import {setupApplication} from '../acceptance/test-helper';
import {ApiGatewayApplication} from '../../application';
import {BookInterface} from '../../interfaces/book-interface';

const BOOK_BASE_URL = process.env.BOOK_BASE_URL ?? 'http://localhost:3001';
const AUTHOR_BASE_URL = process.env.AUTHER_BASE_URL ?? 'http://localhost:3002';
const CATEGORY_BASE_URL =
  process.env.CATEGORY_BASE_URL ?? 'http://localhost:3003';
const mockToken: string =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJhYmNkIiwiZW1haWwiOiJzdHJpbmcxQG1haWwiLCJmaXJzdE5hbWUiOiJhYmMiLCJsYXN0TmFtZSI6ImRlZiIsInBlcm1pc3Npb25zIjpbIkdFVF9BVVRIT1IiLCJQT1NUX0FVVEhPUiIsIlBBVENIX0FVVEhPUiIsIkRFTEVURV9BVVRIT1IiLCJHRVRfQVVUSE9SX0JZX0lEIiwiR0VUX0JPT0siLCJQT1NUX0JPT0siLCJQQVRDSF9CT09LIiwiREVMRVRFX0JPT0siLCJHRVRfQk9PS19CWV9JRCIsIkdFVF9DQVRFR09SWSIsIlBPU1RfQ0FURUdPUlkiLCJQQVRDSF9DQVRFR09SWSIsIkRFTEVURV9DQVRFR09SWSIsIkdFVF9DQVRFR09SWV9CWV9JRCJdLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDQzODYzMDYsImV4cCI6MTc0NDM4OTkwNiwiaXNzIjoiYXBwIn0.MJ8nMUR3yd8vNR2z1LmZ6ZEGWQQ6uXpga6pMSyDguTA';
const authHeader = {
  headers: {Authorization: mockToken},
};

describe('API Gateway Tests', () => {
  let client: Client;
  let app: ApiGatewayApplication;

  before(async () => {
    ({app} = await setupApplication());
    client = createRestAppClient(app);
  });

  afterEach(() => sinon.restore());

  describe('Authentication', () => {
    console.log('123456789', process.env.BOOK_BASE_URL);
    // Test case for sign up and login
    it('should sign up a new user', async () => {
      const mockUser = {
        username: 'abcd',
        password: '11111111',
        email: 'string1@mail',
        firstName: 'abc',
        lastName: 'def',
        role: 'admin',
      };

      sinon.stub(axios, 'post').resolves({data: {message: 'User created'}});

      const res = await client.post('/signup').send(mockUser);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'User created'});
    });
    // Test case for login
    it('should login a user', async () => {
      const loginUser = {username: 'john', password: '123456'};
      const token = {token: 'mock.jwt.token'};

      sinon.stub(axios, 'post').resolves({data: token});

      const res = await client.post('/login').send(loginUser);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql(token);
    });
  });

  describe('Book API', () => {
    // Test case for creating a book
    it('should create a book (with token)', async () => {
      const book: BookInterface = {
        bookId: 'B1',
        title: 'Test Book',
        isbn: '1234567890123',
        authorId: 'A1',
        categoryId: 'C1',
        price: 100,
        discountPercentage: 10,
        discription: 'Desc',
      };

      // Stub GET for author and category validation
      sinon
        .stub(axios, 'get')
        .withArgs(`${AUTHOR_BASE_URL}/authors/${book.authorId}`)
        .resolves({data: {authorId: 'A1', authorName: 'Test Author'}})
        .withArgs(`${CATEGORY_BASE_URL}/categories/${book.categoryId}`)
        .resolves({data: {categoryId: 'C1', categoryName: 'Test Category'}});

      // Stub POST for book creation
      sinon.stub(axios, 'post').resolves({data: {...book}});

      const res = await client
        .post('/books')
        .set('Authorization', authHeader.headers.Authorization)
        .send(book);

      //   console.log('Response:', res.body);
      expect(res.status).to.equal(200);
      expect(res.body).to.containDeep({title: 'Test Book'});
    });
    // Test case for getting all books
    it('should get list of books (with author/category info)', async () => {
      sinon
        .stub(axios, 'get')
        .withArgs(`${BOOK_BASE_URL}/books`)
        .resolves({
          data: [
            {
              bookId: 'b1',
              title: 'Test Book',
              isbn: '1234567890123',
              authorId: 'a1',
              categoryId: 'c1',
              price: 100,
              discountPercentage: 10,
              description: 'Desc',
            },
          ],
        })
        .withArgs(`${AUTHOR_BASE_URL}/authors/a1`)
        .resolves({
          data: {authorName: 'Author One'},
        })
        .withArgs(`${CATEGORY_BASE_URL}/categories/c1`)
        .resolves({
          data: {categoryName: 'Fiction'},
        });

      const res = await client.get('/books').set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0]).to.containDeep({
        author: 'Author One',
        genre: 'Fiction',
      });
    });
    // Test case for updating a book
    it('should update a book', async () => {
      const bookId = 'B1';
      const updatedBook = {
        title: 'Updated Book',
        price: 120,
      };

      sinon.stub(axios, 'patch').resolves({data: {message: 'Book updated'}});

      const res = await client
        .patch(`/books/${bookId}`)
        .set('Authorization', mockToken)
        .send(updatedBook);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Book updated'});
    });
    // Test case for getting a book by ID
    it('should get book by ID', async () => {
      const bookId = 'B1';
      const book = {
        bookId: 'B1',
        title: 'Test Book',
        isbn: '1234567890123',
        authorId: 'A1',
        categoryId: 'C1',
        price: 100,
        discountPercentage: 10,
        discription: 'Desc',
      };

      sinon.stub(axios, 'get').resolves({data: book});

      const res = await client
        .get(`/books/${bookId}`)
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql(book);
    });
    // Test case for deleting a book
    it('should delete a book', async () => {
      const bookId = 'B1';
      sinon.stub(axios, 'delete').resolves({data: {message: 'Book deleted'}});
      const res = await client
        .delete(`/books/${bookId}`)
        .set('Authorization', mockToken);
      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Book deleted'});
    });
    // Test case for getting books without token and expecting 401
    it('should return 401 if token is missing', async () => {
      const res = await client.get('/books');
      expect(res.status).to.equal(401);
    });
  });

  describe('Author API', () => {
    // Test case for creating an author
    it('should create an author', async () => {
      const author = {
        authorId: 'A1',
        authorName: 'John Doe',
      };

      sinon.stub(axios, 'post').resolves({data: {message: 'Author created'}});

      const res = await client
        .post('/authors')
        .set('Authorization', mockToken)
        .send(author);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Author created'});
    });
    // Test case for getting all authors
    it('should get all authors', async () => {
      const authors = [
        {authorId: 'A1', authorName: 'John Doe'},
        {authorId: 'A2', authorName: 'Jane Doe'},
      ];

      sinon.stub(axios, 'get').resolves({data: authors});

      const res = await client.get('/authors').set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql(authors);
    });
    // Test case for updating an author
    it('should update an author', async () => {
      const authorId = 'A1';
      const author = {
        authorName: 'Jane Doe',
      };

      sinon.stub(axios, 'patch').resolves({data: {message: 'Author updated'}});

      const res = await client
        .patch(`/authors/${authorId}`)
        .set('Authorization', mockToken)
        .send(author);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Author updated'});
    });
    // Test case for fetching author by ID
    it('should get author by ID', async () => {
      const authorId = 'A1';
      const author = {
        authorId: 'A1',
        authorName: 'John Doe',
      };

      sinon.stub(axios, 'get').resolves({data: author});

      const res = await client
        .get(`/authors/${authorId}`)
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql(author);
    });
    // Test case for deleting an author
    it('should delete an author', async () => {
      const authorId = 'A1';
      sinon.stub(axios, 'delete').resolves({data: {message: 'Author deleted'}});

      const res = await client
        .delete(`/authors/${authorId}`)
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Author deleted'});
    });
  });
  describe('Category API', () => {
    // Test case for creating a category
    it('should create a category', async () => {
      const category = {
        categoryId: 'C1',
        categoryName: 'Fiction',
      };

      sinon.stub(axios, 'post').resolves({data: {message: 'Category created'}});

      const res = await client
        .post('/categories')
        .set('Authorization', mockToken)
        .send(category);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Category created'});
    });
    // Test case for getting all categories
    it('should get all categories', async () => {
      const categories = [
        {categoryId: 'C1', categoryName: 'Fiction'},
        {categoryId: 'C2', categoryName: 'Non-Fiction'},
      ];

      sinon.stub(axios, 'get').resolves({data: categories});

      const res = await client
        .get('/categories')
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql(categories);
    });
    // Test case for updating a category
    it('should update a category', async () => {
      const categoryId = 'C1';
      const category = {
        categoryName: 'Updated Fiction',
      };

      sinon
        .stub(axios, 'patch')
        .resolves({data: {message: 'Category updated'}});

      const res = await client
        .patch(`/categories/${categoryId}`)
        .set('Authorization', mockToken)
        .send(category);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Category updated'});
    });
    // Test case for getting a category by ID
    it('should get category by ID', async () => {
      const categoryId = 'C1';
      const category = {
        categoryId: 'C1',
        categoryName: 'Fiction',
      };

      sinon.stub(axios, 'get').resolves({data: category});

      const res = await client
        .get(`/categories/${categoryId}`)
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql(category);
    });
    // Test case for deleting a category
    it('should delete a category', async () => {
      const categoryId = 'C1';
      sinon
        .stub(axios, 'delete')
        .resolves({data: {message: 'Category deleted'}});

      const res = await client
        .delete(`/categories/${categoryId}`)
        .set('Authorization', mockToken);

      expect(res.status).to.equal(200);
      expect(res.body).to.eql({message: 'Category deleted'});
    });
  });
});
