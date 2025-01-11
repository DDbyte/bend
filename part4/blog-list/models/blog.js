// models/blog.js
const mongoose = require('mongoose');

// Define schema for Blog
const blogSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: String,
  url: {type: String, required: true},
  likes: {type: Number, default: 0} 
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