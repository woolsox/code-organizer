const fs = require('fs'),
 path = require('path'),
 express = require('express'),
 mustacheExpress = require('mustache-express'),
 passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy,
 session = require('express-session'),
 bodyParser = require('body-parser'),
 flash = require('express-flash-messages'),
 mongoose = require('mongoose'),
 expressValidator = require('express-validator'),
 port = 3000,
 models = require('./models/code'),
 Code = models.Code;

const app = express();

mongoose.connect('mongodb://localhost:27017/codeOrganizer');
mongoose.Promise = require('bluebird');

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({
 extended: true
}));

app.get('/add', function(req, res) {
 res.render('add');
});

app.post('/add', function(req, res) {
 Code.create(req.body).then(function(code) {
  res.redirect('/');
 });
});

app.get('/:id/edit', function(req, res) {
 Code.find({
  _id: req.params.id
 }).then(function(code) {
  res.render('edit', {
   code: code
  });
 });
});

app.post('/:id/edit', function(req, res) {
 Code.findOneAndUpdate({
  _id: req.params.id
 }, req.body).then(function(code) {
  res.redirect('/')
 });
});

app.get('/:id', function(req, res) {
 Code.find({
  _id: req.params.id
 }).then(function(code) {
  res.render('id', {
   code: code
  });
 });
});

// delete button
app.post('/:id', function(req, res) {
 Code.findByIdAndRemove({
  _id: req.params.id
 }).then(function(code) {
  res.redirect('/');
 });
});

app.get('/', function(req, res) {
 Code.find().then(function(code) {
  res.render('home', {
   code: code
  });
 });
});


app.listen(port, function() {
 console.log('Code Organizer running...')
});
