const mongoose = require('mongoose'); //124
const validator = require('validator'); //124
const bcrypt = require('bcryptjs');

//124
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    //126
    validate: {
      //this only works on CREATE and SAVE!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same'
    }
  }
});

//126
userSchema.pre('save', async function(next) {
  //Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

//129
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//124
const User = mongoose.model('User', userSchema);
//124
module.exports = User;
