var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
// const upload = multer({dest: 'uploads/'});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'|| file.mimetype === 'image/PNG' || file.mimetype === 'application/pdf')  {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter 
});


const storag = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilte = (req, file, cb) => {
if (file.mimetype === 'application/pdf')  {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const doc = multer({
    storage: storag,
    fileFilter: fileFilte 
});

//Bring in model
const User = require('../models/user');
const Motivation = require('../models/motivation');
const Book = require('../models/books');
const News = require('../models/news');
const Inspiration = require('../models/inspiration');
const Entertainment = require('../models/entertainment');
const History = require('../models/history');
const Career = require('../models/career');
const Positive = require('../models/positive');
const Discovery = require('../models/discovery');
const Post = require('../models/post');
const Feature = require('../models/feature');
const Recent = require('../models/recent');

router.get('/register', (req, res) =>{
    res.render('register');
});

router.post('/register', async (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const gender = req.body.gender;

    req.checkBody('name', 'Full Name is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('gender', 'Gender not selected').notEmpty();

    let errors = req.validationErrors();
        // const err = err;
    if (errors) {
        console.log(errors);
        res.render('register', {
            errors:errors
        })
    } else {
        let newUser = new User({
            name:name,
            username:username,
            email:email,
            gender:gender,
            password: password
        });
       let userEmail = await User.find({email: req.body.email});
       let newUsername = await User.find({username: req.body.username});

      if (userEmail) {
        req.flash('danger', 'User with this Email Already Exiting!');
        res.redirect('/users/register');
      } else if(newUsername){
        req.flash('danger', `User with this Username  Already Exiting!`);
        res.redirect('/users/register');
      } 
      else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }

                newUser.password = hash;

                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect('/users/login');
                    }
                })
            })
        })
      }

        
    }

});

router.get('/', (req, res) => {
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

router.get('/users?_login', (req, res) => res.render('index'))


router.get('/add/dashboard', ensureAuthenticated, (req, res) =>{
  res.render('dashboard');
});

//route for Book

//Get Route
router.get('/add/books', ensureAuthenticated,(req, res) =>{
  res.render('addBooks');
});


//Post Route
router.post('/add/books', doc.single('imageDoc'),(req, res) =>{

  console.log(req.file);
  let book = new Book();
  book.file = req.file.path;
  book.image = req.file.path;
  book.author = req.user._id;
  book.title = req.body.title;
  book.summary = req.body.summary;

  book.save( (err) =>{
      if (err) {
          console.log(err);
      } else {
          req.flash('success', 'Book Added Successfully');
          res.redirect('/users/add/dashboard');
      }
  });
});

//Route for Career Teaching

//Get Route
router.get('/add/career-teaching', ensureAuthenticated,(req, res) =>{
    res.render('addCareerTeaching');
  });
  
  
  //Post Route
  router.post('/add/career-teaching', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let career = new Career();
    career.file = req.file.path;
    career.author = req.user._id;
    career.title = req.body.title;
    career.summary = req.body.summary;
    career.pg1 = req.body.pg1;
  
    career.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Career Teaching Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });


//Route for Motivation

//Get Route
router.get('/add/motivation', ensureAuthenticated,(req, res) =>{
    res.render('addMotivation');
  });
  
  
  //Post Route
  router.post('/add/motivation', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let motivation = new Motivation();
    motivation.file = req.file.path;
    motivation.author = req.user._id;
    motivation.title = req.body.title;
    motivation.summary = req.body.summary;
    motivation.pg1 = req.body.pg1;
  
    motivation.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Motivational Quote Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });
  


//Route for News-Trend

//Get Route
router.get('/add/newsTrend', ensureAuthenticated,(req, res) =>{
    res.render('addNews');
  });
  
  
  //Post Route
  router.post('/add/newsTrend', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let news = new News();
    news.file = req.file.path;
    news.author = req.user._id;
    news.title = req.body.title;
    news.summary = req.body.summary;
    news.pg1 = req.body.pg1;
  
    news.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'News Trend Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });


//Route for Inspirational Quote

//Get Route
router.get('/add/inspirational-quote', ensureAuthenticated,(req, res) =>{
    res.render('addInspiration');
  });
  
  
  //Post Route
  router.post('/add/inspirational-quote', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let inspiration = new Inspiration();
    inspiration.file = req.file.path;
    inspiration.author = req.user._id;
    inspiration.title = req.body.title;
    inspiration.summary = req.body.summary;
    inspiration.pg1 = req.body.pg1;
  
    inspiration.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Inspiration Quote Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });


//Route for Inspirational Quote

//Get Route
router.get('/add/discovery-your-value', ensureAuthenticated,(req, res) =>{
    res.render('addDiscovery');
  });
  
  
  //Post Route
  router.post('/add/discovery-your-value', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let discovery = new Discovery();
    discovery.file = req.file.path;
    discovery.author = req.user._id;
    discovery.title = req.body.title;
    discovery.summary = req.body.summary;
    discovery.pg1 = req.body.pg1;
  
    discovery.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Discovery Your Value Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });

//Route for Positive Life Changing Tips

//Get Route
router.get('/add/positive-life-changing-tips', ensureAuthenticated,(req, res) =>{
    res.render('addPositive');
  });
  
  
  //Post Route
  router.post('/add/positive-life-changing-tips', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let positive = new Positive();
    positive.file = req.file.path;
    positive.author = req.user._id;
    positive.title = req.body.title;
    positive.summary = req.body.summary;
    positive.pg1 = req.body.pg1;
  
    positive.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Positive Life Changing Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });

//Route for Entertainment

//Get Route
router.get('/add/entertainment', ensureAuthenticated,(req, res) =>{
    res.render('addEntertainment');
  });
  
  
  //Post Route
  router.post('/add/entertainment', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let entertainment = new Entertainment();
    entertainment.file = req.file.path;
    entertainment.author = req.user._id;
    entertainment.title = req.body.title;
    entertainment.summary = req.body.summary;
    entertainment.pg1 = req.body.pg1;
  
    entertainment.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Entertainment Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });

//Route for Entertainment

//Get Route
router.get('/add/history', ensureAuthenticated,(req, res) =>{
    res.render('addHistory');
  });
  
  
  //Post Route
  router.post('/add/history', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let history = new History();
    history.file = req.file.path;
    history.author = req.user._id;
    history.title = req.body.title;
    history.summary = req.body.summary;
    history.pg1 = req.body.pg1;
  
    history.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'History Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });


  router.get('/add/featured-post', ensureAuthenticated,(req, res) =>{
    res.render('addFeatured');
  });
  
  
  //Post Route
  router.post('/add/featured-post', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let post = new Post();
    post.file = req.file.path;
    post.author = req.user._id;
    post.title = req.body.title;
    post.summary = req.body.summary;
    post.pg1 = req.body.pg1;
  
    post.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Featured Post Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });


  router.get('/add/feature-post', ensureAuthenticated,(req, res) =>{
    res.render('addFeatured');
  });
  
  
  //Post Route
  router.post('/add/feature-post', upload.single('imageFile') ,(req, res) =>{
  
    console.log(req.file);
    let feature = new Feature();
    feature.file = req.file.path;
    feature.author = req.user._id;
    feature.title = req.body.title;
    feature.summary = req.body.summary;
    feature.pg1 = req.body.pg1;
  
    feature.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Feature Post Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });

//Login User
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have logout successfully');
    res.redirect('/users/login');
});

router.get('/books/:id', (req, res) =>{
    Book.findById(req.params.id, (err, book) =>{
        User.findById(book.author, (err, user) =>{
            if (err) {
                console.log(err);
            } else {
                res.render('book', {
                    book: book,
                    author: user.username
                });
            }
        })
    })
});


//Router Authenticated
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'You are require to login');
    res.redirect('/users/login');
  }
}

module.exports = router;
