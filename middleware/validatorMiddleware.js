const status = require("../utils/status_codes")

function validateUserInputForSignUp(req, res, next) {
    const errors = []
    const sanitizeData = {
        name: req?.body?.name ? req?.body?.name.trim().toLowerCase() : "",
        email: req?.body?.email ? req?.body?.email.trim().toLowerCase() : "",
        password: req?.body?.password ? req?.body?.password.trim().toLowerCase() : "",
        phone: req?.body?.phone ? req?.body?.phone.trim().toLowerCase() : "",
    }

    if (!sanitizeData?.name || typeof sanitizeData.name !== "string") {
        errors.push("Invalid name")
    }
    if (!sanitizeData?.email || typeof sanitizeData.email !== "string") {
        errors.push("Invalid email")
    } else {
        if (!isEmailValid(sanitizeData?.email)) {
            errors.push("Wrong email. Enter a valid email address")
        }
    }
    if (!sanitizeData?.password || typeof sanitizeData.password !== "string") {
        errors.push("Invalid password")
    }
    if (!sanitizeData?.phone || typeof sanitizeData.phone !== "string") {
        errors.push("Invalid phone number")
    }

    if (!errors.length) {
        req.body = sanitizeData
        next()
    } else {
        res.status(status.HTTP_400_BAD_REQUEST).json({status: 400, message: errors[0]})
    }
}

function isEmailValid(email) {
    const emailChars = /[@.]/;
    return emailChars.test(email)
}

module.exports = validateUserInputForSignUp

