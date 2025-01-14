// controllers/blogs.js

const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const User = require('../models/user')
const config = require('../utils/config')


//const { error } = require('../utils/logger');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username: 1, name: 1})
  response.json(blogs)
})//

// Get blog by id
blogsRouter.get('/:id', async (request, response, next) => {  
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end()
  }
  
})//

// Create a new blog
blogsRouter.post('/', async (request, response) => {  
  const { title, author, url, likes } = request.body;  
  
  // Validate required fields
  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' });
  }

  // Check if the user is authenticated
  const user = request.user; // Extracted user from userExtractor middleware
  if (!user) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  // a new blog object
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id, // Set the creator of the blog
  });

  const savedBlog = await blog.save();

  // update the user's blogs list
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  
  response.status(201).json(savedBlog); // resource created successfully
});//

// Delete 
blogsRouter.delete('/:id', async (request, response) => { 
  // Check if the user is authenticated
  const user = request.user; // Extracted user from userExtractor middleware
  if (!user) {
    return response.status(401).json({ error: 'Token missing or invalid' });
  }

  // Fetch the blog to be deleted
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  // Check if the user requesting the delete owns the blog
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'Permission denied: unauthorized user' });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end(); 
});//

// Update
blogsRouter.put('/:id', async (request, response) => {

const body = request.body
const blog = {
  title: body.title,
  author: body.author,
  url: body.url,
  likes: body.likes
}

const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
response.json(updatedBlog);

})//


// Export 
module.exports = blogsRouter