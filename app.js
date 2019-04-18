const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');


//Connect to mongodb
mongoose.connect(config.database);
const db = mongoose.connection;

//Check DB Connected and Error
db.once('open', () => {
    console.log('Connected to Mongodb on Port 27017 ...')
});

//Check Err
db.on('error', (err) =>{
    console.log(err);
})


//Initialize App
const app = express();

//Bring in models
const Article = require('./model/articles')
const image = require('./model/img');

// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Setting View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

//Set public Folder as Static
app.use(express.static(path.join(__dirname, 'public')));

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
        var namespace = param.split('.'),
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

//Routes fr the Web
app.get('/', (req, res) => {
    Article.find({}, (err, articles) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index',{
                articles:articles
            });
        }
    })
    
});

//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req. user || null;
    next();
});



//Additional Routes
const article = require('./routes/article');
const user = require('./routes/user');
app.use('/article', article);
app.use('/user', user);

//Creating Server
app.listen(3000, () => {
    console.log('Server Started on port 3000 ...');
});