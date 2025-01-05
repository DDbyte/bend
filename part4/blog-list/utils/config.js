// utils/config.js
require('dotenv').config();

const mongoUrl = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3003; // Default to 3003 if PORT is not set

module.exports = {
  mongoUrl,
  PORT
};