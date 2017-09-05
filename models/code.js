const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
 title: {
  type: String,
  required: true
 },
 body: {
  type: String,
  required: true
 },
 notes: {
  type: String
 },
 language: {
  type: String
 },
 tags: {
  type: String
 }
});

const Code = mongoose.model('Code', codeSchema);

module.exports = {
 Code: Code
}
