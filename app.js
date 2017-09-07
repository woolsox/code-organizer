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
 codeOrganizer = 'mongodb://localhost:27017/codeOrganizer',
 codeModels = require('./models/code'),
 userModels = require('./models/user'),
 User = userModels.User,
 Code = codeModels.Code;

const app = express();

mongoose.connect(codeOrganizer);
mongoose.Promise = require('bluebird');

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.use('/static', express.static('static'));
app.use(bodyParser.urlencoded({
 extended: true
}));

var PassportLocalStrategy = require('passport-local');

var authStrategy = new PassportLocalStrategy({
 usernameField: 'username',
 passwordField: 'password'
}, function(username, password, done) {
 User.authenticate(username, password, function(error, user) {
  done(error, user, error ? {
   message: error.message
  } : null);
 });
});

var authSerializer = function(req, user, done) {
 done(null, user.id);
};

var authDeserializer = function(id, done) {
 User.findById(id, function(error, user) {
  done(error, user);
 });
};

app.use(session({
 secret: 'wool socks',
 resave: false,
 saveUninitialized: false,
}));

passport.use(authStrategy);
passport.serializeUser(authSerializer);
passport.deserializeUser(authDeserializer);

app.use(require('connect-flash')());
app.use(passport.initialize());


app.get('/', function(req, res) {
 Code.find().then(function(code, user) {
  res.render('home', {
   code: code
  });
 });
});

app.get('/add', function(req, res) {
 res.render('add');
});

app.post('/add', function(req, res) {
 Code.create(req.body).then(function(code) {
  res.redirect('/');
 });
});

app.get('/login', function(req, res) {
 res.render('login');
});

app.post('/login', passport.authenticate('local', {
 successRedirect: '/',
 failureRedirect: '/login'
}));

app.get('/register', function(req, res) {
 res.render('register');
});

app.post('/register', function(req, res) {
 User.create(req.body).then(function(user) {
  res.redirect('/');
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


// search by tags <-- problem child
app.get('/:language', function(req, res) {
 Code.find({
  language: req.params.language
 }).then(function(code) {
  res.render('language', {
   code: code
  });
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

app.listen(port, function() {
 console.log('Code Organizer running...')
});
