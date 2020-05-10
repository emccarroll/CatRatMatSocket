const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let socketMap = new Schema({
    user: String,
    socketID: String

});

module.exports = mongoose.model('socketMap', socketMap);