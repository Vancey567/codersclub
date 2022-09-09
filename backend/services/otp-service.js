const crypto = require('crypto');
const hashService = require('./hash-Service');

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSid, smsAuthToken, {
    lazyLoading: true
});

class OtpService {
    async generateOtp() {
        const otp = crypto.randomInt(1000, 9999); // This will generate a random number of 4 digit
        return otp;
    }

    async sendBySms(phone, otp) {
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your Codersclub OTP is ${otp}`,
        });
    }

    async verifyOtp(hashedOtp, newData) {
        let computedHash = hashService.hashOtp(newData); // This is the new hash that we will create now
        return computedHash === hashedOtp;// If both the earlier hasedOtp and newly computedHash are equal then return true else return false and this code will do that. 
    }
}

module.exports = new OtpService();