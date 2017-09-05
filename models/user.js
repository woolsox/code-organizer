const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
 username: {
  type: String,
  unique: true,
  lowercase: true,
  required: true
 },
 passwordHash: {
  type: String,
  required: true
 }
});

const User = mongoose.model('User', userSchema);

module.exports = {
 User: User
};
