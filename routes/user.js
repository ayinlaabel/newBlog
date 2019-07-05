const express = require('express');
const mongoose = require('mongoose');
const routes = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in model
const User = require('../model/user');
const Article = require('../model/articles');

routes.get('/register', (req, res) =>{
    res.render('register');
});

routes.post('/register', (req, res) => {
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
                        res.redirect('/user/login');
                    }
                })
            })
        })
    }

});

routes.get('/', (req, res) => {
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

routes.get('/user?_login', (req, res) => res.render('index'))


//Login User
routes.get('/login', (req, res) => {
    res.render('login');
});

routes.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/user?_login',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

routes.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have logout successfully');
    res.redirect('/user/login');
});



module.exports = routes;