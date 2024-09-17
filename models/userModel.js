const mongoose = require("mongoose")
const {hashPassword, verifyPassword} = require("../utils/hash_password")

const UserSchema = mongoose.Schema({
    name: {type: String, required: true, maxlength: 50},
    email: {type: String, required: true, maxlength: 50},
    phone: {type: String},
    password: {type: String, required: true, maxlength: 255},
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now()}
})

UserSchema.pre("save", async function(next) {
    if (!this.isModified('password')) {
        return next()
    } else {
        let password = this.password
        const hashedPassword = await hashPassword(password)
        this.password = hashedPassword
        next()
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User