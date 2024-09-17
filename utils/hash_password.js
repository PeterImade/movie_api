const argon2 = require("argon2")

async function hashPassword(plainPassword) {
    try {
        const hashedPassword = await argon2.hash(plainPassword)
        return hashedPassword
    } catch (error) {
        console.log(error);
    }
}

async function verifyPassword(hashedPassword, plainPassword) {
    try {
        const isMatch = await argon2.verify(hashedPassword, plainPassword)

        if (isMatch) {
            console.log("Password is correct");
            return isMatch
        } else {
            console.log("Password is incorrect");
            return isMatch
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { hashPassword, verifyPassword }