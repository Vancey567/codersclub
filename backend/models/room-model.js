const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({ // Since Schema is a class we need to create a object of it
    topic: { type: String, required: true },
    roomType: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' }, // taking refrence from User schema
    speakers: { // speakers will be an array type 
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        required: false 
    },
}, {timestamps: true});

module.exports = mongoose.model('Room', roomSchema, 'rooms'); // Model Refresh, Schema to be used, Collection name(tokens) in mongodb