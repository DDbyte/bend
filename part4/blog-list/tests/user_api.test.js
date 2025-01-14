//tests/blog_api.test.js
const { after, describe, it, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user');

//supertest instance used to send http reqs to the app without starting the server
const api = supertest(app)
  
describe('User API tests', () => {
    beforeEach(async () => {
      // Clear the database before each test
      await User.deleteMany({});
    });
  
    it('should create a user with valid data', async () => {
      const newUser = {
        username: 'validUser',
        name: 'Valid User',
        password: 'securePass123',
      };
  
      const response = await api.post('/api/users').send(newUser).expect(201);
      assert.strictEqual(response.body.username, newUser.username);
  
      const usersAtEnd = await User.find({});
      assert.strictEqual(usersAtEnd.length, 1);
      assert.strictEqual(usersAtEnd[0].username, newUser.username);
    });
  
    it('should fail with 400 if username is missing', async () => {
      const newUser = {
        name: 'No Username',
        password: 'securePass123',
      };
  
      const response = await api.post('/api/users').send(newUser).expect(400);
      assert.strictEqual(response.body.error, 'Username must be at least 3 characters long');

    });
  
    it('should fail with 400 if password is missing', async () => {
        const newUser = {
          username: 'ValidUser',
          name: 'No Password',
        };
      
        const response = await api.post('/api/users').send(newUser).expect(400);
        assert.strictEqual(response.body.error, 'Password must be at least 3 characters long');
      });
      
  });
  

//cleanup: close database connection
after(async () => {
    await mongoose.connection.close()
})//