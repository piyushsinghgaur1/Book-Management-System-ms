import {
  get,
  post,
  patch,
  del,
  requestBody,
  param,
  HttpErrors,
} from '@loopback/rest';
import axios from 'axios';
import {BookValidator} from '../validations/validate-book';
import {AuthorValidator} from '../validations/validate-author';
import {CategoryValidator} from '../validations/validate-category';
import {BookInterface} from '../interfaces/book-interface';
import config from '../config';
const {
  DEVELOPMENT: {BOOK_BASE_URL, AUTHOR_BASE_URL, CATEGORY_BASE_URL},
} = config;

export class ApiGatewayController {
  private bookServiceUrl = BOOK_BASE_URL;
  private authorServiceUrl = AUTHOR_BASE_URL;
  private categoryServiceUrl = CATEGORY_BASE_URL;
  private bookValidator = BookValidator.getInstance();

  constructor() {}

  // Books endpoints
  @post('/books')
  async createBook(@requestBody() book: BookInterface) {
    try {
      await this.bookValidator.validate(book);
    } catch (error) {
      console.error('Validation failed:', error.message);
      throw error;
    }
    const response = await axios.post(`${this.bookServiceUrl}/books`, book);
    return response.data;
  }

  @get('/books')
  async getBooks() {
    try {
      const booksResponse = await axios.get(`${this.bookServiceUrl}/books`);
      const books = booksResponse.data;
      const booksWithDetails = await Promise.all(
        books.map(async (book: any) => {
          try {
            const author = await this.fetchAuthor(book.authorId);
            if (!author) {
              throw new HttpErrors.BadRequest('Author not found');
            }
            const category = await this.fetchCategory(book.categoryId);
            if (!category) {
              throw new HttpErrors.InternalServerError('Category not found');
            }
            return {
              bookId: book.bookId,
              title: book.title,
              isbn: book.isbn,
              discountPercentage: book.discountPercentage,
              price: book.price,
              author: author.authorName,
              genre: category.categoryName,
              discription: book.discription,
            };
          } catch (error) {
            console.error('Failed to fetch author or category:', error.message);
            return book;
          }
        }),
      );
      return booksWithDetails;
    } catch (error) {
      return {error: 'Failed to fetch books', details: error.message};
    }
  }

  @get('/books/{id}')
  async getBookById(@param.path.string('id') id: string) {
    const response = await axios.get(`${this.bookServiceUrl}/books/${id}`);
    return response.data;
  }

  @patch('/books/{id}')
  async updateBookById(
    @param.path.string('id') id: string,
    @requestBody() book: any,
  ) {
    const response = await axios.patch(
      `${this.bookServiceUrl}/books/${id}`,
      book,
    );
    return response.data;
  }

  @del('/books/{id}')
  async deleteBookById(@param.path.string('id') id: string) {
    const response = await axios.delete(`${this.bookServiceUrl}/books/${id}`);
    return response.data;
  }

  private async fetchAuthor(authorId: string) {
    try {
      const response = await axios.get(
        `${this.authorServiceUrl}/authors/${authorId}`,
      );
      return response.data;
    } catch (error) {
      return {error: `Author not found for id ${authorId}`};
    }
  }

  private async fetchCategory(categoryId: string) {
    try {
      const response = await axios.get(
        `${this.categoryServiceUrl}/categories/${categoryId}`,
      );
      return response.data;
    } catch (error) {
      return {error: `Category not found for id ${categoryId}`};
    }
  }

  // Authors endpoints
  @post('/authors')
  async createAuthor(@requestBody() author: any) {
    try {
      AuthorValidator.getInstance().validate(author); // Validate using the singleton instance
    } catch (error) {
      throw error; // If validation fails, throw the error
    }
    const response = await axios.post(
      `${this.authorServiceUrl}/authors`,
      author,
    );
    return response.data;
  }

  @get('/authors')
  async getAllAuthors() {
    const response = await axios.get(`${this.authorServiceUrl}/authors`);
    return response.data;
  }

  @get('/authors/{id}')
  async getAuthorById(@param.path.string('id') id: string) {
    const response = await axios.get(`${this.authorServiceUrl}/authors/${id}`);
    return response.data;
  }

  @patch('/authors/{id}')
  async updateAuthor(
    @param.path.string('id') id: string,
    @requestBody() author: any,
  ) {
    const response = await axios.patch(
      `${this.authorServiceUrl}/authors/${id}`,
      author,
    );
    return response.data;
  }

  @del('/authors/{id}')
  async deleteAuthor(@param.path.string('id') id: string) {
    const response = await axios.delete(
      `${this.authorServiceUrl}/authors/${id}`,
    );
    return response.data;
  }

  // Categories endpoints
  @post('/categories')
  async createCategory(@requestBody() category: any) {
    try {
      CategoryValidator.getInstance().validate(category); // Validate using the singleton instance
    } catch (error) {
      throw error; // If validation fails, throw the error
    }
    const response = await axios.post(
      `${this.categoryServiceUrl}/categories`,
      category,
    );
    return response.data;
  }

  @get('/categories')
  async getAllCategories() {
    const response = await axios.get(`${this.categoryServiceUrl}/categories`);
    return response.data;
  }

  @get('/categories/{id}')
  async getCategoryById(@param.path.string('id') id: string) {
    const response = await axios.get(
      `${this.categoryServiceUrl}/categories/${id}`,
    );
    return response.data;
  }

  @patch('/categories/{id}')
  async updateCategory(
    @param.path.string('id') id: string,
    @requestBody() category: any,
  ) {
    const response = await axios.patch(
      `${this.categoryServiceUrl}/categories/${id}`,
      category,
    );
    return response.data;
  }

  @del('/categories/{id}')
  async deleteCategory(@param.path.string('id') id: string) {
    const response = await axios.delete(
      `${this.categoryServiceUrl}/categories/${id}`,
    );
    return response.data;
  }
}
