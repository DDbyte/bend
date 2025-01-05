const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for the root path
app.get('/', (request, response) => {
  response.send('Welcome to the Blog API!');
});

// Route to get all blogs
app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch((error) => {
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// Route to create a new blog
app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);
  
  blog.save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch((error) => {
      response.status(400).json({ error: 'Bad Request' });
    });
});

// Start the server
const PORT = process.env.PORT || 3003; // Default port fallback in case environment variable is not set
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});