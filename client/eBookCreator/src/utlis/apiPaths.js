export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/me",
  },
  BOOKS: {
    CREATE_BOOK: "/api/books",
    CREATE_TEMPLATE_BOOK: "/api/books/template",
    GET_BOOKS: "/api/books",
    GET_BOOK_BY_ID: "/api/books", // Usually you'd append `/:id` when fetching by ID
    UPDATE_BOOK: "/api/books",
    DELETE_BOOK: "/api/books",
    UPDATE_COVER: "/api/books/cover",
  },
  AI: {
    GENERATE_OUTLINE: "/api/ai/generate-outline",
    GENERATE_CHAPTER_CONTENT: "/api/ai/generate-chapter-content",
  },
  EXPORT: {
    PDF: "/api/export/pdf",
    DOC: "/api/export/doc",
  },
};
export const BASE_URL = "http://localhost:8000";
