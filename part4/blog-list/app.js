// app.js
const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
require('express-async-errors') //before routes
const blogRouter = require('./controllers/blogs'); 
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

// Set mongoose 
mongoose.set('strictQuery', false);

// Log connection attempt
logger.info('Connecting to', config.mongoUrl);

// Connect to MongoDB
mongoose.connect(config.mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

// Create Express app
const app = express();

// Middleware setup
app.use(cors()); 
app.use(express.static('dist')); 
app.use(express.json()); 
app.use(middleware.requestLogger); 

// Define API routes
app.use('/api/blogs', blogRouter); 

// Handle unknown endpoints
app.use(middleware.unknownEndpoint);

// Error handling middleware
app.use(middleware.errorHandler);

// Export the app for use in index.js
module.exports = app;