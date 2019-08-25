var express = require('express');
var router = express.Router();



//Bring in models
const Book = require('../models/books');
const User = require('../models/user');


router.get('/', (req, res) =>{
    Book.find({}, (err, books) =>{
        if (err) {
            console.log(err)
        } else {
            res.render('books', {
                books:books
            });
        }
    });
});

router.get('/review/:id', (req, res) =>{
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

module.exports = router;