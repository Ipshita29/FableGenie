const Book = require("../models/Book");
const mongoose = require("mongoose");
const { generateOutline } = require("./aiController");

// @desc    Create a new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    const { title, author, subtitle, chapters } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Please provide title and author" });
    }

    let coverImage = null;
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    // Parse chapters if it's a string (from FormData)
    let parsedChapters = chapters;
    if (typeof chapters === 'string') {
      try {
        parsedChapters = JSON.parse(chapters);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid chapters format" });
      }
    }

    const book = await Book.create({
      user: req.user.id,
      title,
      author,
      subtitle,
      coverImage,
      chapters: parsedChapters || [],
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
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(id);

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

    book.coverImage = cover || book.coverImage;
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

// @desc    Create a template book with AI-generated outline
// @route   POST /api/books/template
// @access  Private
const createTemplateBook = async (req, res) => {
  try {
    const { title, author, numChapters, topic, style } = req.body;

    if (!title || !numChapters) {
      return res.status(400).json({ message: "Please provide title and number of chapters" });
    }

    let coverImage = null;
    if (req.file) {
      coverImage = `/uploads/${req.file.filename}`;
    }

    // Generate AI outline for the book
    const outline = await generateOutline({
      title,
      numChapters: parseInt(numChapters),
      topic: topic || "",
      style: style || "Informative",
    });

    // Create chapters array from outline
    const chapters = outline.chapters.map((chapter, index) => ({
      title: chapter.title,
      content: chapter.content || "",
      order: index + 1,
    }));

    const book = await Book.create({
      user: req.user.id,
      title,
      author,
      subtitle: topic ? `A ${style} guide on ${topic}` : "",
      coverImage,
      chapters,
      status: "draft",
    });

    res.status(201).json({
      message: "Template book created successfully with AI outline",
      book,
    });
  } catch (error) {
    console.error("Template book creation error:", error);
    res.status(500).json({ message: "Server error creating template book" });
  }
};

module.exports = {
  createBook,
  createTemplateBook,
  getBooks,
  getBookById,
  updateBook,
  updateBookCover,
  deleteBook,
};
