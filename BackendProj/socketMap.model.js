const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let socketMap = new Schema({
    type: Map,
        of: [String]

});

module.exports = mongoose.model('socketMap', socketMap);