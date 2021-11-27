const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ // Since Schema is a class we need to create a object of it
    phone: { type: String, required: true },
    activated: { type: Boolean, required: false, default: false } // If the user has updated their name, and profile picture or not
}, {timeStamp: true});

module.exports = mongoose.model('User', userSchema, 'users'); // Model name, Schema to be used, Collection name in mongodb