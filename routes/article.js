const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const routes = express.Router();

//Bring in Model
const Article = require('../model/articles');

//Get Article
routes.get('/article', (req, res) =>{
    res.render('add_article');
});

//Add Article
routes.post('/article',  (req, res) => {
    const article = new Article();

    article.title = req.body.title;
    article.summary = req.body.summary;
    article.article = req.body.article;

    article.save( (err) =>{
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Added Successfully');
            res.redirect('/');
        }
    });
});

//View Article
routes.get('/:id',  (req, res) => {
    Article.findById(req.params.id, (err, article) => {
        res.render('article', {
            article: article
        });
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
routes.post('/edit/:id',  (req, res) => {
    const article = {};

    article.title = req.body.title;
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
routes.delete('/article/:id', (req, res) =>{
    let query = {_id:req.params.id};

    Article.remove(query, (err) =>{
        if (err) {
            console.log(err);
        } else {
            // res.redirect('/');
            res.send('success');
        }
    })
})
module.exports = routes;