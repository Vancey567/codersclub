const tokenService = require('../services/token-service');

module.exports = async function(req, res, next) {
    try {
        // Get the token from the cookie using the key(accessToken) inside the cookie. Which will be inside our req.cookies
        const { accessToken } = req.cookies;
        if(!accessToken) {
            throw new Error(); // this err will be catched inside the catch block
        }
        const userData = await tokenService.verifyAccessToken(accessToken);  // If some error occur while verifying in the other file we will send a error which will be catched inside the catch() block
        if(!userData) {
            throw new Error();
        }
        req.user = userData; // We will attach the userData on the request by create a key "user". So that we can access the user info inside controller
        next();
    } catch(err) {
        console.log(err);
        res.status(401).json({message: "Invalid Token"});
    }
};



// We will send the access and refresh token inside cookie on every request. We need to parse and get the tokens from the cookie and check if the token is valid or not. or if it is expired.

