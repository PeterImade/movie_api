const status = require("../../utils/status_codes")
const User = require("../../models/userModel")
const { check_if_user_exist_with_email, check_if_user_exist_with_id } = require("../../utils/userExist")
const { encode_token, decode_token } = require("../../utils/token_mgt")

const { verifyPassword } = require("../../utils/hash_password")

class AuthenticateUser {
    static async login(req, res) {
        try {
            if (!req.body) {
                res.status(status?.HTTP_422_UNPROCESSABLE_ENTITY).json({ status: 422, message: "Unprocessible request body. Please provide a valid data." })
            }
            else {
                const foundUser = await check_if_user_exist_with_email(req?.body?.email)
                if (!foundUser) {
                    res.status(status?.HTTP_404_NOT_FOUND).json({ status: 404, message: "User with this email not found" })
                } else {
                    const isVerifiedPassword = await verifyPassword(foundUser?.password, req?.body?.password)

                    if (!isVerifiedPassword) {
                        res.status(status?.HTTP_400_BAD_REQUEST).json({ status: 400, message: "password or email Entered does not match" })
                    } else {
                        const accessToken = encode_token(foundUser?._id, '10m')
                        const refreshToken = encode_token(foundUser?._id, '3d')

                        if (accessToken && refreshToken) {
                            res.status(status?.HTTP_200_OK).json({ status: 200, access_token: accessToken, refresh_token: refreshToken, message: "You have been logged in successfully" })
                        }
                    }
                }
            }

        } catch (error) {
            res.status(status?.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }


    static async refresh_token(req, res) {
        try {
            if (!req.body?.refresh_token) {
                res.status(status?.HTTP_422_UNPROCESSABLE_ENTITY).json({ status: 422, message: "Unprocessible request body. Please provide a valid data." })
            } else {
                const userId = decode_token(req.body.refresh_token)
                if (!userId) {
                    res.status(status?.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "Token not provided or token has expired" })
                } else {
                    const accessToken = encode_token(userId, "10m")
                    const refresh_token = encode_token(userId, "7d")
                    if (accessToken && refresh_token) {
                        res.status(status?.HTTP_200_OK).json({ status: 200, access_token: accessToken, refresh_token: refresh_token })
                    }
                }
            }
        } catch (error) {
            res.status(status?.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }
}

module.exports = AuthenticateUser