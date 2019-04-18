const mongoose = require('mongoose');
const multer = require('multer');

//Set Storage Engine Image
const Image = require('./img')

const articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    summary:{
        type: String,
        required: true
    },
    article:{
        type: String,
        required: true
    },
    // image:{
    //     type: Image,
    //     required: true
    // }
});

const Article = module.exports = mongoose.model('Article', articleSchema);