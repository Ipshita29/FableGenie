const Book = require("../models/Book");

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, subtitle, coverImage, chapters } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Please provide title and author" });
    }

    const book = await Book.create({
      user: req.user.id,
      title,
      author,
      subtitle,
      coverImage,
      chapters: chapters || [],
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all books for a user
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { title, author, subtitle, coverImage, chapters, status } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.subtitle = subtitle || book.subtitle;
    book.coverImage = coverImage || book.coverImage;
    book.chapters = chapters || book.chapters;
    book.status = status || book.status;

    const updatedBook = await book.save();
    res.json({
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update book cover
// @route   PUT /api/books/:id/cover
// @access  Private
const updateBookCover = async (req, res) => {
  try {
    const { cover } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    book.cover = cover || book.cover;
    const updatedBook = await book.save();

    res.json({
      message: "Book cover updated successfully",
      updatedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await book.deleteOne();

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  updateBookCover,
  deleteBook,
};
