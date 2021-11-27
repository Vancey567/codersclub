const jwt = require('jsonwebtoken');
// import jwt from 'jsonwebtoken'
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

class TokenService {
    generateTokens(payload) { // payload is basically the user data that we want to add in the token. We can pass user data like user id and activated field in the payload
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1h' // 1h means 1hour for banks it would be arounr 1min 2min
        });

        // refreshtoken are used to generate new access Token automatically when the access token expires in 1 or 2 minutes
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y' // 1y means 1year
        });
        console.log(`accessToken: ${accessToken}, refreshToken: ${refreshToken}`);
        console.log("generateTokens called");

        return { accessToken, refreshToken }
    }
}

module.exports = new TokenService();