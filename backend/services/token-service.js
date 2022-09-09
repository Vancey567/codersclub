const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel = require('../models/refresh-model');
class TokenService {
    generateTokens(payload) { // payload is basically the user data that we want to add in the token. We can pass user data like user id and activated field in the payload
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1m',
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y',
        });
        return { accessToken, refreshToken };
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({ // Import refreshModel on which we have a method called create which is used to create the model
                token,
                userId,
            });
        } catch (err) {
            console.log("Error While Storing Refresh Token")
            console.log(err.message);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret); // Since we are verifing the accessToken we will need to give the accessTokenSecret
    }

    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret); 
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({ // These _id and token feilds are inside DB
            userId: userId, 
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshToken) { // pass the data to be updated first pass the id(To filter which document to be updated) then the data to be updated i.e. newly generated token 
        return await refreshModel.updateOne(
            { userId: userId },
            { token: refreshToken }
        );
    }

    async removeToken(refreshToken) {
        return await refreshModel.deleteOne({ token: refreshToken }); // if the token in DB is equals to the passed refreshToken then delet that refreshToken from the DB
    }
}

module.exports = new TokenService();
