const express = require("express");
const router = express.Router();

const {
  createBook,
  createTemplateBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
} = require("../controller/bookController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Apply protect middleware to all routes in this file
router.use(protect);

// Create & Get all books
router.route("/")
  .post(upload, createBook)
  .get(getBooks);

// Create template book with AI outline
router.route("/template")
  .post(upload, createTemplateBook);

// Update book cover (with image upload)
router.route("/cover/:id").put(upload, updateBookCover);

// Get, Update, Delete a specific book by ID
router.route("/:id")
  .get(getBookById)
  .put(updateBook)
  .delete(deleteBook);


module.exports = router;
