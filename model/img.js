// const mongoose = require('mongoose');
// const multer = require('multer');
// const config = require('../config/database');
// const path = require('path');

// //Set Storage Engine Image
// const image = multer.diskStorage({
//     destination: 'mongodb://localhost/nnamdi',
//     filename: (req, file, cb) => {
//         cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const Image = module.exports = mongoose.model('Image', image);