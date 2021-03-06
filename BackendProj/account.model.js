const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Account = new Schema({
    user: String,
    passwordHash: String,
    authSession: String,
    messages: [{fromUser:String,toUser:String,message: String,readStatus:Boolean}],
    following: {
        type: Map,
        of: Boolean
    }
});

module.exports = mongoose.model('Account', Account);