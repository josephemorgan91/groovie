const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require("./models/user");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({extended: true, inflate: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "sometimes dogs fart",
	resave: false,
	saveUnserialized: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

try {
	mongoose.connect("mongodb+srv://joe:f1reandbl00d@cluster0-jouci.mongodb.net/groovie?retryWrites=true&w=majority")
} catch(error) {
	console.log(err);
}

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
