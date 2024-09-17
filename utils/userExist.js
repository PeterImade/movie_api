const User = require("../models/userModel")

async function check_if_user_exist_with_email(userEmail = "") {
    if (!userEmail) return false
    try {
        const response = await User.findOne({ email: userEmail })
        if (response) {
            return response
        } else {
            return false
        }
    } catch (error) {
        console.log(error);
        return error.message
    }
}

async function check_if_user_exist_with_id(userId = "") {
    if (!userId) return false
    try {
        const response = await User.findOne({ _id: userId })
        const isExist = response ? true : false
        return isExist
    } catch (error) {
        console.log(error);
        return error.message
    }
}

module.exports = {
    check_if_user_exist_with_email,
    check_if_user_exist_with_id
}
