//tests/blog_api_token.test.js

const { expect } = require('chai');
const { test, beforeEach, describe } = require('node:test');
const request = require('supertest');
const app = require('../app'); 
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

describe('POST /api/blogs', () => {
  beforeEach(async () => {
    // Clear database before each test
    await Blog.deleteMany({});
    await User.deleteMany({});

    // Create a user for valid token tests
    await User.create({
      username: 'testuser',
      name: 'Test User',
      passwordHash: 'hashedpassword',
    });
  });

  test('fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10,
    };

    const response = await request(app).post('/api/blogs').send(newBlog); // No 'Authorization' header

    expect(response.status).to.equal(401); // check for 401 Unauthorized
    
  });

  test('successfully adds a blog when a valid token is provided', async () => {
    // Fetch the created user to get their ID
    const user = await User.findOne({ username: 'testuser' });

    // Generate a valid token for the user
    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: '1h' });

    const newBlog = {
      title: 'Authorized Blog',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10,
    };

    const response = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Set a valid token in the Authorization header
      .send(newBlog);

    expect(response.status).to.equal(201); // check status code is 201 (Created)
    expect(response.body.title).to.equal(newBlog.title); // check response contains the correct title
    expect(response.body.author).to.equal(newBlog.author); // check response contains the correct author

    // check the blog is saved in the DB
    const blogs = await Blog.find({});
    expect(blogs).to.have.lengthOf(1);
    expect(blogs[0].title).to.equal(newBlog.title);
  });
});
