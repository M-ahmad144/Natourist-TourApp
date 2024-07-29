const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter a  email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'leade-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false, // Ensure password is not returned in queries
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //value point to the confirmPassword Value
      validator: function (value) {
        return this.password === value;
      },
      message: 'Passwords do not match',
    },
  },

  passwordChangedAt: Date,
});

//Hashing on the password

//The pre('save') middleware specifically runs before a document is saved to the database.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //there is no need to store passwordConfirm in the database. Storing it would be redundant and could pose a security risk
  this.passwordConfirm = undefined;
  next();
});

//this method is instance method - therefore it will be available all user documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  password,
) {
  return await bcrypt.compare(candidatePassword, password);
};

// Method to check if the password was changed after a specific timestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  // Check if passwordChangedAt is defined
  if (this.passwordChangedAt) {
    // Convert the passwordChangedAt date to a timestamp
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000, // Convert to seconds
      10,
    );

    // Compare the JWT timestamp with the passwordChanged timestamp
    return JWTTimestamp < passwordChangedTimestamp;
  }

  // If passwordChangedAt is not set, return false
  return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
