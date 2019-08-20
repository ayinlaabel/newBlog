const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    file:{
        type: String,
        // required: true
    },
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        // required: true
    },
    summary:{
        type: String,
        required: true
    },
    // iage:{
    //     type: String,
    //     required: true
    // }m
});


const Book = module.exports = mongoose.model('Book', bookSchema);