
//models/user.js
const mongoose = require('mongoose')

//custom validator for username
const usernameValidator = (username) => /^[a-zA-Z0-9_.-]+$/.test(username); // Only allows letters, numbers, underscores, hyphens, and periods.

//custom validator for password
const passwordValidator = (password) => {
  // minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

// define the schema
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      validate: {
        validator: usernameValidator,
        message: 'Username can only contain letters, numbers, underscores, hyphens, and periods',
      },
    },
    name: String,
    passwordHash: {
      type: String,
      required: [true, 'Password is required']      
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
});//

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User