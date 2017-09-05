const mongoose = require('mongoose');
const hash = require('password-hash');

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  unique: true,
  lowercase: true,
  required: true
 },
 password: {
  type: String,
  required: true,
  set: function(newValue) {
   return hash.isHashed(newValue) ? newValue : hash.generate(newValue);
  }
 }
});

userSchema.statics.authenticate = function(username, password, callback) {
 this.findOne({
  username: username
 }, function(error, user) {
  if (user && hash.verify(password, user.password)) {
   callback(null, user);
  } else if (user || !error) {
   // Email or password was invalid (no MongoDB error)
   error = new Error("Your email address or password is invalid. Please try again.");
   callback(error, null);
  } else {
   // Something bad happened with MongoDB. You shouldn't run into this often.
   callback(error, null);
  }
 });
};

const User = mongoose.model('User', userSchema);

module.exports = {
 User: User
};
