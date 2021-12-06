const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ // Since Schema is a class we need to create a object of it
    phone: { type: String, required: true },
    name: { type: String, required: false },
    avatar: {  // This will be string because we will store the file path as string. And required false cuz when we create the user the avatar is not with us initially
        type: String,
        required: false,
        get: (avatar) => { // This is a getter function. We need to pass the current avatar into the function. And inside this function we need to return the base url and after that we will append the avatar we are getting. We are doing this because when we populate the speakers inside the rooms service we are getting on the folder path of the image not the whole url so we need to add the base url to the folder path so that we are able to get the speakers image onto the room card component(P8 1:28)  
            if(avatar) {
                return `${process.env.BASE_URL}${avatar}`
            }
            return avatar;
        },
    },
    activated: { type: Boolean, required: false, default: false } // If the user has updated their name, and profile picture or not
}, 
    {
        timestamps: true,
        toJSON: { getters: true } // We need to make it true in order to use the get function
    }
);

module.exports = mongoose.model('User', userSchema, 'users'); // Model name, Schema to be used, Collection name in mongodb