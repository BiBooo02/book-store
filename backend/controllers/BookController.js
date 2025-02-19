const Book = require("../models/Book");
const mongoose = require("mongoose");

// GET all books
const getBooks = async (req, res) => {
  const books = await Book.find({}).sort({ createdAt: -1 });

  res.status(200).json(books);
};

// GET a specific book
const getBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID format" });
  }

  const book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({ error: "Workout not found" });
  }

  res.status(200).json(book);
};

// Create a new book
const addBook = async (req, res) => {
  const { title, author, description, price, image } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!author) {
    emptyFields.push("author");
  }
  if (!description) {
    emptyFields.push("description");
  }
  if (!price) {
    emptyFields.push("price");
  }
  if (!image) {
    emptyFields.push("image");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all the fields!", emptyFields });
  }

  // Add the new book to the database
  try {
    const book = await Book.create({
      title,
      author,
      description,
      price,
      image,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a book

const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID format" });
  }

  const book = await Book.findByIdAndDelete(id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json({ message: "Book deleted successfully", book });
};

// UPDATE a book

const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Book not found" });
  }

  const book = await Book.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json({ message: "Book updated successfully" });
};

// Export the functions
module.exports = {
  addBook,
  getBooks,
  getBook,
  deleteBook,
  updateBook,
};
