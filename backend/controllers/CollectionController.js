const UserBook = require("../models/UserBook");
const mongoose = require("mongoose");

// GET all books in collections
const getCollections = async (req, res) => {
  try {
    const books = await UserBook.find({}).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET books by collection type
const getBooksByCollection = async (req, res) => {
  const { collection } = req.params;

  const validCollections = ["wantToRead", "currentlyReading", "doneReading"];
  if (!validCollections.includes(collection)) {
    return res.status(400).json({ error: "Invalid collection type" });
  }

  try {
    const books = await UserBook.find({ collection }).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ADD book to collection
const addToCollection = async (req, res) => {
  const {
    bookId,
    title,
    author,
    description,
    image,
    publishedDate,
    isbn,
    collection,
  } = req.body;

  let emptyFields = [];

  if (!bookId) emptyFields.push("bookId");
  if (!title) emptyFields.push("title");
  if (!collection) emptyFields.push("collection");

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Please fill in all required fields!",
      emptyFields,
    });
  }

  const validCollections = ["wantToRead", "currentlyReading", "doneReading"];
  if (!validCollections.includes(collection)) {
    return res.status(400).json({ error: "Invalid collection type" });
  }

  try {
    // Check if book already exists in any collection
    const existingBook = await UserBook.findOne({ bookId });

    if (existingBook) {
      // Update existing book's collection
      const updateData = { collection };

      if (collection === "currentlyReading") {
        updateData.startedReadingAt = new Date();
      } else if (collection === "doneReading") {
        updateData.finishedReadingAt = new Date();
        // If moving to doneReading, require review
        if (
          !req.body.review ||
          !req.body.review.rating ||
          !req.body.review.review
        ) {
          return res.status(400).json({
            error:
              "Review is required when adding book to 'Done Reading' collection",
            requiresReview: true,
          });
        }
        updateData.review = req.body.review;
      }

      const updatedBook = await UserBook.findOneAndUpdate(
        { bookId },
        updateData,
        { new: true }
      );

      return res.status(200).json(updatedBook);
    } else {
      // Create new book in collection
      const bookData = {
        bookId,
        title,
        author: Array.isArray(author) ? author : [author],
        description: description || "",
        image: image || "",
        publishedDate: publishedDate || "",
        isbn: isbn || "",
        collection,
      };

      if (collection === "currentlyReading") {
        bookData.startedReadingAt = new Date();
      } else if (collection === "doneReading") {
        bookData.finishedReadingAt = new Date();
        if (
          !req.body.review ||
          !req.body.review.rating ||
          !req.body.review.review
        ) {
          return res.status(400).json({
            error:
              "Review is required when adding book to 'Done Reading' collection",
            requiresReview: true,
          });
        }
        bookData.review = req.body.review;
      }

      const book = await UserBook.create(bookData);
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE book collection
const updateCollection = async (req, res) => {
  const { id } = req.params;
  const { collection, review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID format" });
  }

  const validCollections = ["wantToRead", "currentlyReading", "doneReading"];
  if (!validCollections.includes(collection)) {
    return res.status(400).json({ error: "Invalid collection type" });
  }

  try {
    const updateData = { collection };

    if (collection === "currentlyReading") {
      updateData.startedReadingAt = new Date();
    } else if (collection === "doneReading") {
      updateData.finishedReadingAt = new Date();
      if (!review || !review.rating || !review.review) {
        return res.status(400).json({
          error:
            "Review is required when moving book to 'Done Reading' collection",
          requiresReview: true,
        });
      }
      updateData.review = review;
    }

    const book = await UserBook.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ADD/UPDATE review for done reading book
const addReview = async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID format" });
  }

  if (!rating || !review) {
    return res.status(400).json({ error: "Rating and review are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const book = await UserBook.findByIdAndUpdate(
      id,
      {
        review: { rating, review },
        collection: "doneReading",
        finishedReadingAt: new Date(),
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE book from collection
const removeFromCollection = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID format" });
  }

  const book = await UserBook.findByIdAndDelete(id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res
    .status(200)
    .json({ message: "Book removed from collection successfully", book });
};

module.exports = {
  getCollections,
  getBooksByCollection,
  addToCollection,
  updateCollection,
  addReview,
  removeFromCollection,
};
