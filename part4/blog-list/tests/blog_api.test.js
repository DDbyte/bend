//tests/blog_api.test.js

const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, getBlogs, postBlog } = require('./test_helper'); // import helpers

const Blog = require('../models/blog')
const { text } = require('node:stream/consumers')

//supertest instance used to send http reqs to the app without starting the server
const api = supertest(app)
  
//initialize the database
beforeEach(async () => {    
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs)
})//

//verify blogs are returned as JSON and correct count
test('blogs are returned as json and contain the correct amount', async () => {
  const blogs = await getBlogs(api)
    //assert to check the response length
    assert.strictEqual(blogs.length, initialBlogs.length, 'Incorrect number of blogs returned')
})//

//verify the unique id property is named 'id'
test('blog posts have id instead of _id', async () => {
  const blogs = await getBlogs(api)  

  //assert all blogs have id instead _id
  blogs.forEach(blog => {
    assert(blog.id, 'blog does not have an id property')
    assert(!blog._id, 'blog has an _id propery')
  })
})//

//verify that a POST req successfully creates a new blog
test('HTTP POST req to /api/blogs successfully creates a new blog post', async () => {
  const nBlog = {
    title: 'New Blog Test Post',
    author: 'Alice Smith',
    url: 'http://example.com/new-blog',
    likes: 40,
  }

  //verify the res content
  const createdBlog = await postBlog(api, nBlog)
  assert.strictEqual(createdBlog.title, nBlog.title)
  assert.strictEqual(createdBlog.author, nBlog.author)
  assert.strictEqual(createdBlog.url, nBlog.url)
  assert.strictEqual(createdBlog.likes, nBlog.likes)

  //verify total number of blogs
  const allBlogs = await Blog.find({})
  assert.strictEqual(allBlogs.length, initialBlogs.length+1)

  //verify the newly added blog is saved based on title
  const titles = allBlogs.map(blog => blog.title)
  assert(titles.includes(nBlog.title), 'new blog POST not found in db')

})//

//verify if likes propery is missing, it defaults to zero
test('if likes property is missing, it defaults to zero', async () => {
  const nBlog = {
    title: 'Blog Without Likes',
    author: 'Alex Author',
    url: 'http://example.com/testnolikes',
  }

  
  const createdBlog = await postBlog(api, nBlog)

  //assert if likes default to zero
  assert.strictEqual(createdBlog.likes, 0, 'the likes property did not default to zero' )
})//

//test, missing title
test('POST fails w/ 400 if title is missing', async () => {
  const nBlog = {
    author: 'Author No Title',
    url: 'http://example.com/test-no-title',
  }
  const postRes400 = await api
    .post('/api/blogs')
    .send(nBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  //'title and url are required': The expected error message that the backend should return.
  assert.strictEqual(postRes400.body.error, 'title and url are required', 'Incorrect error message')

  const allBlogs = await Blog.find({})
  assert.strictEqual(allBlogs.length, initialBlogs.length, 'the blog added despite missing title')

})//

//test Delete
test('DELETE  successfully deletes a blog', async () => {
  const allBlogs = await Blog.find({});
  const blogDelete = allBlogs[1]

  await api
    .delete(`/api/blogs/${blogDelete.id}`)
    .expect(204)

  const remainedBlogs = await Blog.find({})
  assert.strictEqual(remainedBlogs.length, allBlogs.length - 1)
  const ids = remainedBlogs.map(blog => blog.id)
  assert(!ids.includes(blogDelete.id))
})//

// test Update
test('PUT successfully updates a blog', async () => { 
  const allBlogs = await Blog.find({})
  const blogUpdate = allBlogs[0] 

  const updatedData = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'http://example.com/updated',
    likes: blogUpdate.likes + 10, 
  }

  // PUT request
  const response = await api
    .put(`/api/blogs/${blogUpdate.id}`)
    .send(updatedData)
    .expect(200) // Expect 200 OK
    .expect('Content-Type', /application\/json/)

  // verify the response content
  assert.strictEqual(response.body.title, updatedData.title, 'Title was not updated')
  assert.strictEqual(response.body.author, updatedData.author, 'Author was not updated')
  assert.strictEqual(response.body.url, updatedData.url, 'URL was not updated')
  assert.strictEqual(response.body.likes, updatedData.likes, 'Likes were not updated')

  // verify the updated blog from DB
  const updatedBlog = await Blog.findById(blogUpdate.id);
  assert.strictEqual(updatedBlog.title, updatedData.title, 'DB title was not updated')
  assert.strictEqual(updatedBlog.author, updatedData.author, 'DB author was not updated')
  assert.strictEqual(updatedBlog.url, updatedData.url, 'DB URL was not updated')
  assert.strictEqual(updatedBlog.likes, updatedData.likes, 'DB likes were not updated')
})//

//cleanup: close database connection
after(async () => {
    await mongoose.connection.close()
})//