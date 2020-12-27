var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define comments Schema

var comments = new Schema({
    user: {
        type: String,
        require: true
    },
    classCode: {
        type: String,
        require: true
    },
    text: String,
    createDate: String
});



module.exports = mongoose.model('Comments', comments);