const express = require('express');
const routes = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'|| file.mimetype === 'image/PNG') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


//Bring in Model
const Article = require('../models/articles');
const User = require('../models/user');


//Get Article
routes.get('/article', ensureAuthenticated, (req, res) =>{
    res.render('add_article');
});

//Add Article
routes.post('/article', upload.single('image'), (req, res, next) => {
    const article = new Article();

    article.title = req.body.title;
    article.author = req.user._id;
    article.summary = req.body.summary;
    article.article = req.body.article;
    article.image = req.file.path;

    article.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Added Successfully');
            res.redirect('/');
        }
    });
});



//Get Edit Article
routes.get('/edit/:id', (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        if (err) {
            console.log(err)
        } else {
            res.render('edit_article', {
                article:article
            });
        }
    });
    
});

//Post Article
routes.post('/edit/:id', ensureAuthenticated,  (req, res) => {
    const article = {};

    article.title = req.body.title;
    article.author = req.user._id;
    article.summary = req.body.summary;
    article.article = req.body.article;

    let query = {_id:req.params.id};

    Article.update(query,article, (err) =>{
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated Successfully');
            res.redirect('/');
        }
    });
});


//Delete Article
routes.delete('/:id', (req, res) =>{
    let query = {_id:req.params.id};

    Article.remove(query, (err) =>{
        if (err) {
            console.log(err);
        } else {
            // res.redirect('/');
            res.send('success');
        }
    });
});

//View Article
routes.get('/:id',  (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, (err, user) => {
            res.render('article', {
                article: article,
                author: user.username
            });
        });
    });
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'User Not Login, Please Login');
        res.redirect('/user/login');
    }
}

module.exports = routes;