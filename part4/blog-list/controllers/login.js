//controllers/login.js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')
//const secretKey = process.env.SECRET || '---secret-key*'

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  //get the user, check password w/ compare()
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    //401 unauthorized
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  //create the token, contains the username and the user id in a digitally signed form
  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.JWT_SECRET, {expiresIn: 60*60})

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})//

module.exports = loginRouter