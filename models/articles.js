const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
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
    image:{
        type: String,
        required: true
    }
});


const Article = module.exports = mongoose.model('Article', articleSchema);