const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel = require('../models/refresh-model')


class TokenService {

    generateTokens(payload) { // payload is basically the user data that we want to add in the token. We can pass user data like user id and activated field in the payload
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1m' // 1h means 1hour for banks it would be arounr 1min 2min represneted by 1m
        });

        // refreshtoken are used to generate new access Token automatically when the access token expires in 1 or 2 minutes
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y' // 1y means 1year
        });
        return { accessToken, refreshToken }
    }

    // Create a model to store refreshToken in the DB.
    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({ // Import refreshModel on which we have a method called create which is used to create the model
                token,
                userId,
            })
        } catch(err) {
            console.log(err.message);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret); // Since we are verifyin the accessToken we will need to give the accessTokenSecret
    }

    async verifyRefreshToken(token) {
        return jwt.verify(token, refreshTokenSecret); // Since we are verifyin the accessToken we will need to give the accessTokenSecret
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({
            userId: userId, // These _id and token feilds are inside DB
            token: refreshToken,
        })
    }

    async updateRefreshToken(userId, refreshToken) {
        return await refreshModel.updateOne( // pass the data to be updated first pass the id(To filter which document to be updated) then the data to be updated i.e. newly generated token 
            { userId: userId }, 
            { token: refreshToken }
        );
    }

    async deleteRefreshToken(refreshToken) {
        return await refreshModel.deleteOne({ token: refreshToken }); // if the token in DB is equals to the passed refreshToken then delet that refreshToken from the DB
    }
}

module.exports = new TokenService();