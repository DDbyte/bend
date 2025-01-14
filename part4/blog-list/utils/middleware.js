// utils/middleware.js

const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');
const { request, response } = require('../app');
const config = require('../utils/config')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7); // Extract token after 'Bearer '
  } else {
    request.token = null;
  }
  next();
};//


const userExtractor = async (request, response, next) => {
  const token = request.token; // get token directly from the request object, thanks to tokenExtractor

  if (!token) {
    request.user = null; // no token, set user to null
    return next(); // to the next middleware
  }

  try {
    // decode the token
    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    
    if (decodedToken.id) {
      // Fetch the user based on the token's id
      const user = await User.findById(decodedToken.id);
      request.user = user || null; // attach the user or null if not found
    } else {
      request.user = null; // invalid token payload
    }
  } catch (error) {
    logger.error('Failed to verify token or fetch user:', error);
    request.user = null; // set user as null if token verification fails
  }
  next(); // to the next middleware or route handler
};//

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  // log body only for POST, PUT requests 
  if (['POST', 'PUT'].includes(request.method)) {
    logger.info('Body:  ', request.body)
  }
  logger.info('---')
  next()
}//

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}//

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}//

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}