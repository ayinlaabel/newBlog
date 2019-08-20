var express = require('express');
var router = express.Router();



//Bring in models
const Article = require('../model/articles');
const User = require('../model/user');


/* GET home page. */
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


module.exports = router;
