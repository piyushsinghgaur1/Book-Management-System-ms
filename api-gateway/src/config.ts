import dotenv from 'dotenv';
dotenv.config();
const config = {
  DEVELOPMENT: {
    BOOK_BASE_URL: process.env.BOOK_BASE_URL,
    AUTHOR_BASE_URL: process.env.AUTHOR_BASE_URL,
    CATEGORY_BASE_URL: process.env.CATEGORY_BASE_URL,
  },
};
export default config;
