import {HttpErrors} from '@loopback/rest';
import {BookInterface} from '../interfaces/book-interface';
import axios from 'axios';
import config from '../config';
const {
  DEVELOPMENT: {AUTHOR_BASE_URL, CATEGORY_BASE_URL},
} = config;

export class BookValidator {
  private static instance: BookValidator;
  private authorServiceUrl = AUTHOR_BASE_URL;
  private categoryServiceUrl = CATEGORY_BASE_URL;

  // Private constructor to prevent instantiation
  private constructor() {}

  // Method to fetch author by ID
  private async fetchAuthor(authorId: string) {
    try {
      const response = await axios.get(
        `${this.authorServiceUrl}/authors/${authorId}`,
      );
      return response.data || null;
    } catch (error) {
      return null;
    }
  }

  // Method to fetch category by ID
  private async fetchCategory(categoryId: string) {
    try {
      const response = await axios.get(
        `${this.categoryServiceUrl}/categories/${categoryId}`,
      );
      return response.data || null;
    } catch (error) {
      return null;
    }
  }

  // Get instance of the BookValidator class
  public static getInstance(): BookValidator {
    if (!BookValidator.instance) {
      BookValidator.instance = new BookValidator();
    }
    return BookValidator.instance;
  }

  // Validation logic
  public async validate(book: BookInterface): Promise<void> {
    // Validate book ID
    if (!book.bookId.startsWith('B')) {
      throw new HttpErrors.BadRequest('Book ID must start with "B"');
    }

    // Validate title
    if (!book.title) {
      throw new HttpErrors.BadRequest('Title is required');
    }

    // Validate ISBN
    if (!book.isbn) {
      throw new HttpErrors.BadRequest('ISBN is required');
    }

    // Validate price
    if (!book.price) {
      throw new HttpErrors.BadRequest('Price is required');
    }

    // Validate authorId
    if (!book.authorId || !book.authorId.startsWith('A')) {
      throw new HttpErrors.BadRequest(
        'Author ID is required and must start with "A"',
      );
    }

    // Validate categoryId
    if (!book.categoryId || !book.categoryId.startsWith('C')) {
      throw new HttpErrors.BadRequest(
        'Category ID is required and must start with "C"',
      );
    }

    // Validate description
    if (!book.discription) {
      throw new HttpErrors.BadRequest('Description is required');
    }

    // Validate price (should be a number)
    if (isNaN(book.price)) {
      throw new HttpErrors.BadRequest('Price must be a valid number');
    }

    // Validate discount percentage (if present, it should be a number between 0 and 100)
    if (book.discountPercentage !== undefined) {
      if (book.discountPercentage < 0 || book.discountPercentage > 100) {
        throw new HttpErrors.BadRequest(
          'Discount percentage must be between 0 and 100',
        );
      }
    }

    // Check if author exists
    const author = await this.fetchAuthor(book.authorId);
    if (!author) {
      throw new HttpErrors.BadRequest(
        `Author with ID ${book.authorId} not found`,
      );
    }

    // Check if category exists
    const category = await this.fetchCategory(book.categoryId);
    if (!category) {
      throw new HttpErrors.BadRequest(
        `Category with ID ${book.categoryId} not found`,
      );
    }
  }
}
