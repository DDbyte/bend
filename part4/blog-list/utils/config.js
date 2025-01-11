// utils/config.js
require('dotenv').config();

console.log('NODE_ENV:', process.env.NODE_ENV)

const mongoUrl = process.env.NODE_ENV === 'test' 
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI

console.log('MongoDB URL in use:', mongoUrl)

const PORT = process.env.PORT || 3003; // Default to 3003 if PORT is not set

module.exports = {
  mongoUrl,
  PORT
};