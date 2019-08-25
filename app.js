const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

//Connect to mongodb
mongoose.connect(config.database);
const db = mongoose.connection;

//Check DB Connected and Error
db.once('open', () => {
    console.log('Connected to Mongodb on Port 27017 ...');
   let gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('articles');
});

//Check Err
db.on('error', (err) =>{
    console.log(err);
});


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// Middlewares
//Delete Request For Method-Override
app.use(methodOverride('_method'));

//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setting View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

//Set public Folder as Static
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

//Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

//Connect-Flash Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: (param, msg, value) =>{
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return{
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));



//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Additional Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articleRouter = require('./routes/article');
const bookRouter = require('./routes/books');
app.use('/books', bookRouter);
app.use('/article', articleRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
