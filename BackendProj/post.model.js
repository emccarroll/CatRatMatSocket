const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let Post = new Schema({
    user: String,
    votes: Number,
    src: String,
    text: String,
    comments: [{user:String,text: String}],
    voters: {
        type: Map,
        of: String
    }
    
});

module.exports = mongoose.model('Post', Post);