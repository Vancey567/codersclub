const Jimp = require('jimp');
const path = require('path');
const userService = require('../services/user-service')
const UserDto = require('../dtos/user-dtos')


class ActivateController {
    async activate(req, res) {
        // Activation Logic
        const { name, avatar } = req.body;
        if(!name || !avatar) {
            res.status(400).json({message: "All fields are required!"});
        }

        // Image We get is in Base64 string. We need to convert it and make a image out of this code and store it in our file system.
        // For this we use node core module.(Buffer)
        // We will convert the base64 image in nodejs buffer first
        const buffer = Buffer.from( // first we will pass the base64 image but we need to split something like data:image\/png;base64, with empty string ''. Second the base64 is the encoding. 
            // avatar.replace(/^data:image\/png;base64,/,''),
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''),
            'base64'
        );

        // Give names to the images stored/append inside your file system. // 15234555445-746382656934.png
        const imagePath = `${Date.now()}-${Math.round(
            Math.random() * 1e9 // it 1e9 will generate 10^9 random number(billion)
        )}.png`; // will store it in png format


        // If we received the string in wrong format then we need to handle it else the server will crash
        try {
            const jimResp = await Jimp.read(buffer); // Jimp will read the buffer and it will create a object after reading the buffer
            jimResp
            .resize(150, Jimp.AUTO)  // width, height
            // .quality(60) // set JPEG quality
            // .greyscale() // set greyscale
            .write(path.resolve(__dirname, `../storage/${imagePath}`));// call the resize() method by passing width and then height to it but we will keep the height as auto else the image aspect ratio. And on that resized image we will call the write() insside which we will pass path where we want the image to be stored/written. For that we will use the path module
        } catch(err) {
            console.log(err);
            res.status(500).json({message: "Could not process the image"});
        }

        const userId = req.user._id;

        // Update user
        try {
            const user = await userService.findUser({ _id: userId });
            if(!user) {
                res.status(404).json({message: "User not found"});
            }

            // If user exists, then update the user
            user.activated = true;
            user.name = name; // we get name from above where we destructured it.
            user.avatar = `/storage/${imagePath}`; // we will store the path of the image with the name of the folder because we have not attached it with the pasthname

            user.save(); // Save the user to the database
            res.json({ user: new UserDto(user), auth: true }); // If everything went right we will send the updated user. We are sending the flag auth: true cuz we need it on client.
        } catch(err) {
            console.log(err);
            res.status(500).json({message: "Something wnet wrong while storing user in the DB"});
        }

    }
}

module.exports = new ActivateController();