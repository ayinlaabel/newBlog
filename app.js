const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
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


//Initialize App
const app = express();

//Bring in models
const Article = require('./model/articles');
const User = require('./model/user');

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



//Passport Config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//Init gfs
let gfs;

db.once('open', () =>{
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('articles');
});

//Create Storage Engine

const storage = new GridFsStorage({
    url: config.database,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'articles'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

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
    });
    
});

app.get('/foods', (req, res) =>{
  Article.find({}, (err, articles)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('foods', {
        articles:articles
      });
    }
  });
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