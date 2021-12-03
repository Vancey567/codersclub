const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshSchema = new Schema({ // Since Schema is a class we need to create a object of it
    token: { type: String, required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'User' }, // taking refrence from User schema
}, {timestamps: true});

module.exports = mongoose.model('Refresh', refreshSchema, 'tokens'); // Model Refresh, Schema to be used, Collection name(tokens) in mongodb