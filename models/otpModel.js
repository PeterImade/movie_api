const mongoose = require("mongoose")

const OtpSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true},
    otp: {type: String, required: true},
    otpExpiry: {type: Date, required: true},
    created_at: {type: Date, expires: "5m", default: Date.now},
    updated_at: {type: Date, default: Date.now}
})
const Otp = mongoose.model("OTP", OtpSchema)

module.exports = Otp;

