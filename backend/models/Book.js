const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const bookSchema = new mongoose.Schema({
 title: {
  type: String,
  required: true,
 },
 author: {
  type: String,
  required: true,
 },
 description: {
  type: String,
  required: true,
 },
 price: {
  type: Number,
  required: true,
 },
 image: {
  type: String,
  required: true,
 }
}, {timestamps: true});

module.exports = mongoose.model('Book', bookSchema);