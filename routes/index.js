var express = require('express');
var router = express.Router();



//Bring in models
const Book = require('../models/books');
const Motivation = require('../models/motivation');
const Career = require('../models/career');
const Discovery = require('../models/discovery');
const Entertainment = require('../models/entertainment');
const History = require('../models/history');
const Inspiration = require('../models/inspiration');
const News = require('../models/news');
const Positive = require('../models/positive');
const Post = require('../models/post');
const User = require('../models/user');


/* GET home page. */
router.get('/', (req, res) => {
  Book.find({}, (err, books) => {
    Motivation.find({}, (err, motivations) => {
      Post.find({}, (err, posts) => {
      // User.findById(books.author, motivations.author, (err, user) => {
          if (err) {
            console.log(err)
        } else {
            res.render('index',{
                books:books,
                motivations: motivations,
                posts: posts,
                // author: user.name
            });
        }
      });
    });
  });
  
});

router.get('/career-teaching', (req, res) =>{
  Career.find({}, (err, careers)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('careerTeaching', {
        careers:careers
      });
    }
  });
});

router.get('/discovery-your-value', (req, res) =>{
  Discovery.find({}, (err, discoveries)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('discovery', {
        discoveries:discoveries
      });
    }
  });
});

router.get('/entertainment', (req, res) =>{
  Entertainment.find({}, (err, entertainments)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('entertainment', {
        entertainments:entertainments
      });
    }
  });
});

router.get('/history', (req, res) =>{
  History.find({}, (err, histories)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('history', {
        histories:histories
      });
    }
  });
});

router.get('/inspirational-quote', (req, res) =>{
  Inspiration.find({}, (err, inspirations)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('inspiration', {
        inspirations:inspirations
      });
    }
  });
});

router.get('/news-trend', (req, res) =>{
  News.find({}, (err, news)=>{
    if (err) {
      console.log(err);
    } else {
      res.render('newsTrend', {
        news:news
      });
    }
  });
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

module.exports = router;
