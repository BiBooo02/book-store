const express = require('express');
const { addBook, getBooks, getBook, deleteBook, updateBook} = require('../controllers/BookController');

const router = express.Router();

// GET all books
router.get('/', getBooks);

// GET a specific book
router.get('/:id', getBook);

// POST a new book
router.post('/', addBook);

// DELETE a book
router.delete('/:id', deleteBook);

// UPDATE a book
router.patch('/:id', updateBook)

module.exports = router;