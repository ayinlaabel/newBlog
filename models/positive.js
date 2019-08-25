const mongoose = require('mongoose');

const positiveSchema = mongoose.Schema({
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
    pg1:{
        type: String,
        required: true
    },
    pg2:{
        type: String,
        // required: true
    },
    pg3:{
        type: String,
        // required: true
    },
    pg4:{
        type: String,
        // required: true
    },
    pg5:{
        type: String,
        // required: true
    },
    summary:{
        type: String,
        // required: true
    },
    // iage:{
    //     type: String,
    //     required: true
    // }m
});


const Positive = module.exports = mongoose.model('Positive', positiveSchema);