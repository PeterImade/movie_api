const status = require("../../utils/status_codes")
const User = require("../../models/userModel")
const {check_if_user_exist_with_email, check_if_user_exist_with_id} = require("../../utils/userExist")

class RegisterUser {
    static async signup(req, res) {
        try {
            if (!req.body) {
                res.status(status.HTTP_422_UNPROCESSABLE_ENTITY).json({status: 422, message: "Unprocessible request body. Please provide a valid data."})
            } else {
                const foundUser = await check_if_user_exist_with_email(req?.body?.email)
                if (foundUser) {
                    res.status(status.HTTP_409_CONFLICT).json({status: 409, message: "User with this email already exist"})
                } else {
                    const newUser = await new User({
                        name: req?.body?.name,
                        email: req?.body?.email,
                        password: req?.body?.password,
                        phone: req?.body?.phone
                    })

                    await newUser.save()

                    res.status(status.HTTP_201_CREATED).json({status: 201, user: newUser, message: "Your account has been created successfully"})
                }
            }
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({status: 500, message: error?.message})
        }
    }
}


module.exports = RegisterUser