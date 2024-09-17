const jwt = require("jsonwebtoken")

function encode_token(userId, expireIn = "5m") {
    const secret_key = process.env.SECRET_KEY
    if (!userId && !secret_key) {
        return false
    }
    const token = jwt.sign({userId}, secret_key, {expiresIn: expireIn})
    return token
}

function decode_token(token) {
    const secret = process.env.SECRET_KEY
    if (!token && !secret) {
        return false
    }
    const {userId} = jwt.verify(token, secret)
    if (!userId) {
        return false
    }
    return userId
}

module.exports = {encode_token, decode_token}
