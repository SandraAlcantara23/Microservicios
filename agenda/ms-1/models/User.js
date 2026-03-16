const moongose = require('mongoose');

const userSchema = new moongose.Schema({
    email: {type: String, unique: true},
    password: String,
    });

module.exports = moongose.model('User', userSchema); 