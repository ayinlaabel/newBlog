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
if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'|| file.mimetype === 'image/PNG' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

//Bring in model
const User = require('../model/user');
const Motivation = require('../model/motivation');
const Book = require('../model/books');

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

router.get('/add/dashboard', ensureAuthenticated, (req, res) =>{
  res.render('dashboard');
});

//route for Book

//Get Route
router.get('/add/books', ensureAuthenticated,(req, res) =>{
  res.render('addBooks');
});


//Post Route
router.post('/add/books', upload.single('imageFile') ,(req, res) =>{

  console.log(req.file);
  let book = new Book();
  book.file = req.file.path;
  book.author = req.user._id;
  book.title = req.body.title;
  book.summary = req.body.summary;

  book.save( (err) =>{
      if (err) {
          console.log(err);
      } else {
          req.flash('success', 'Book Added Successfully');
          res.redirect('/');
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
            req.flash('success', 'Article Added Successfully');
            res.redirect('/users/add/dashboard');
        }
    });
  });
  


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have logout successfully');
    res.redirect('/users/login');
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
