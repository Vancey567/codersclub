const crypto = require('crypto');

class HashService {
    hashOtp(data) { // The data/OTP which we want to hash is received here
        // This is used for hashing the data, First it Takes the algorithm to be used, second it takes the secret key because 
        // when the 2nd time the user/client send the otp then we can match it, and to match it we will need to generate a new hash
        // using the same secret. 
        // Then we will chain a update() where we will pass the data to be hash and then we will digest it.
        // It generate a buffer string by default so we need to mention the datatype inside digest() in which you want the hashed data to be stored.
        return crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex'); // It will generate and return the hashed value
    }
}

module.exports = new HashService();

// we can use crypto.randomBytes(64).toString('hex') to generate a random string for secret






// const crypto = require('crypto');

// class HashService {
//     hashOtp(data) { // The data/OTP which we want to hash is received here
//         return crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex'); // It will generate and return the hashed value
//     }
// }

// module.exports = new HashService();



