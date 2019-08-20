var express = require('express');
var router = express.Router();



//Bring in models
const Book = require('../model/books');
const Motivation = require('../model/motivation');
const User = require('../model/user');


/* GET home page. */
router.get('/', (req, res) => {
  Book.find({}, (err, articles) => {
    Motivation.find({}, (err, motivations) => {
      if (err) {
        console.log(err)
    } else {
        res.render('index',{
            articles:articles,
            motivations: motivations
        });
    }
    });
  });
  
});

router.get('/foods', (req, res) =>{
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

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

module.exports = router;
