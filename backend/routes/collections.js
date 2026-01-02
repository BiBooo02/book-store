const express = require('express');
const {
  getCollections,
  getBooksByCollection,
  addToCollection,
  updateCollection,
  addReview,
  removeFromCollection
} = require('../controllers/CollectionController');

const router = express.Router();

// GET all books in collections
router.get('/', getCollections);

// GET books by collection type
router.get('/:collection', getBooksByCollection);

// POST add book to collection
router.post('/', addToCollection);

// PATCH update book collection
router.patch('/:id', updateCollection);

// POST add/update review
router.post('/:id/review', addReview);

// DELETE remove book from collection
router.delete('/:id', removeFromCollection);

module.exports = router;

