const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ // Since Schema is a class we need to create a object of it
    phone: { type: String, required: true },
    name: { type: String, required: false },
    avatar: { type: String, required: false }, // This will be string because we will store the file path as string. And required false cuz when we create the user the avatar is not with us initially
    activated: { type: Boolean, required: false, default: false } // If the user has updated their name, and profile picture or not
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema, 'users'); // Model name, Schema to be used, Collection name in mongodb