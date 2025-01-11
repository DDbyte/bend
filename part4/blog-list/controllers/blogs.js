// controllers/blogs.js
const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const { error } = require('../utils/logger');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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
  const {title, author, url, likes} = request.body
  
  if(!title || !url) {
    return response.status(400).json({error: 'title and url are required'})
  }

  const blog = new Blog({title, author, url, likes})
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog) //default status code(200 OK) changed w/ 201 resource creation  
})//

// Delete
blogsRouter.delete('/:id', async (request, response) => { 
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end() 
})//

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