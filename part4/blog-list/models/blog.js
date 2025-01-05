// models/blog.js
const mongoose = require('mongoose');

// Define schema for Blog
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  });

// Create and export the Blog model
module.exports = mongoose.model('Blog', blogSchema);