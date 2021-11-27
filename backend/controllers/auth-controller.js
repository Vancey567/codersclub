// Using class the code becomes modular
const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dtos');

class AuthController {
    // Write logics here for routers end points
    async sendOtp(req, res) { // Its a method not function and we don't need to write function keyword before the sendOtp(){}
        const { phone } = req.body; // Get the phone number from body and destructuring it.
        
        if(!phone) {
            res.status(400).json({message: 'Phone number is required!'});
        }
        
        // We need to generate a 4 digit random number to send it as otp
        // Node has a inbuilt module called CRYPTO which can be used for many things like hashing, sign, verify, cypher, decypher,
        // crypto.randomInt(1000, 9999) this will generate a randon 4 digit number under those range evertime this is called.
        // Here we will be importing the servive layer(Js file only) which helps us to make our code modular
        const otp = await otpService.generateOtp(); // This will return a promise

        // Now we need to hash the OTP because we will send the hashed OTP to the client. We will node store any OTP in our database
        const ttl = 1000 * 60 * 60 * 24 * 15; // ttl is "time to live" 1000 millisecond * 60 = 1 minute and multiply by 2 will live for 2 minutes 
        const expires = Date.now() + ttl;// It will give the time when it will expire. Current time se 2 minute baad expire ho jayega OTP 
        const data = `${phone}.${otp}.${expires}`; // We aren't only hasing the otp but generating a new data using phone, random otp and expires time and then we are hasing it so that hash become a little unique 
        
        const hash = hashService.hashOtp(data); // We are calling hashService class and inside that we have a method which takes otp and hash that otp

        // To send messages for OTP we will use a service called Twilio.
        try {
            // await otpService.sendBySms(phone, otp); // Pass phone and normal otp for sending to the user not the hashed otp
            
            res.json({
                hash: `${hash}.${expires}`, // We will send a hash. The expires time will be extracted
                phone: phone,
                otp
            });
        } catch(err) {
            console.log(err);
            res.status(500).json({message: 'Message sending failed'});
        }
        // After sending the otp to the user we will send that otp to the server to verify and when this otp is varified on the server we will then only we will create the user and store it in the database.
        res.json({hash: hash}); // We will send hash on to the client
    }


    async verifyOtp(req, res) {
        // Logic to veryfy OTP
        const { otp, hash, phone } = req.body;
        if(!otp || !hash || !phone) {
            res.status(400).json({message: 'All fields are required'});
        }

        // Now split the hash as we append expired time with .
        const [ hashedOtp, expires ] = hash.split('.'); // we get the hash from request and we will split the hashed value and the expires using dot.
        if(Date.now() > +expires) { // expires came from user so it is a string. If we give + before expires then it will explicitly convert it to Number 
            res.status(400).json({message: 'OTP expired'});
        }

        const data = `${phone}.${otp}.${expires}`; // We are giving the same data so our hash will be the same hash
        const isValid = otpService.verifyOtp(hashedOtp, data);// we will create a new data 
        // We will then compared the received hashed OTP and the (data)hash and if both matchs that means the OTP is valid and the user has given the same OTP.
        // This verify OTP will be done at service level
        
        if(!isValid) {
            res.status(400).json({message: 'Invalid OTP'});
        }

        // We have kept this user outside because let are block scoped and they wont be available outside so that we can use it 
        let user;
        // let accessToken;

        try {
            user = await userService.findUser({phone: phone});// Find the user from the data using there phone number
            
            // If the user is not present in the DB, then we will create a new user in the DB and store it inside user variable
            if(!user) {
                user = await userService.createUser({ phone: phone }); 
            }
        } catch(err) {
            console.log(err);
            res.status(500).json({ message: "DB error" });
        }


        // Generate JWT token
        const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false }); // this will give us the returned object with two values which can be extracted using the object  destructuring.
        console.log(`accessToken: ${accessToken}, refreshToken: ${refreshToken}`);
        // Now we will attach this refreshToken to the cookie which will be http only i.e client pe hamara JS read nahi kar payega.
        // Cookie feature is that it gets attach to request on every request. So we don't need to send the refreshToken on every request manually if we store it inside the cookie. Our frontend will automatically send the refreshToken on every request with the cookie.
        // Many a times accessToken are also stored in the cookie.
        // But here we will store our accessToken inside our local storage and refreshToken will kept in the cookie so that it gets send everytime we make a request.
    
        // Creating cookkie
        res.cookie('refreshToken', refreshToken, { // first 'refreshToken' is the name of the cookie and second refreshToken is the actual refreshToken data
            maxAge: 1000 * 60 * 60 * 24 * 30, // valid for 30 days 
            httpOnly: true, // this is the type of the cookie.
        }) 

        // Create object of the UserDto class. THis will return the class object having the property as id, phone, activated, createdAt
        // We will get only those data which we want and have created inside the class by passing it as response.
        const userDto = new UserDto(user);


        res.json({ accessToken, user: userDto });
    }
}


// We will export the class not by giving reference but by creating object using new keyword. We are exporting the object and this pattern is called "Singleton Pattern"
// Singleton Pattern: Means whenever we require this AuthController class we will "get the same object" instead of creating a new object evertime we require the class. 
module.exports = new AuthController();