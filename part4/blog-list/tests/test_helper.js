//tests/test_helper.js
const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'First Blog',
      author: 'John Doe',
      url: 'http://example.com/first',
      likes: 10,
    },
    {
      title: 'Second Blog',
      author: 'Jane Doe',
      url: 'http://example.com/second',
      likes: 20,
    },
    {
        title: 'Third Blog',
        author: 'Alex Doe',
        url: 'http://example.com/third',
        likes: 30,
      },
  ]//

const getBlogs = async (api) => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

return response.body // return the response body for further assertions
}//

const postBlog = async (api, nBlog) => {
    const response = await api
      .post('/api/blogs')
      .send(nBlog)
      .expect(201) // 201 Created
      .expect('Content-Type', /application\/json/);
  
    return response.body; //return the created blog for further assertions
}

module.exports = {initialBlogs, getBlogs, postBlog }