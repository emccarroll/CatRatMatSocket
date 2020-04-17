const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Account = new Schema({
    user: String,
    passwordHash: String,
    authSession: String
});

module.exports = mongoose.model('Account', Account);