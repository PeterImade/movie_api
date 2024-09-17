const jwt = require("jsonwebtoken")
const status = require("../utils/status_codes")
const {check_if_user_exist_with_id} = require("../utils/userExist")

async function authenticateUser(req, res, next) {
    const secret = process.env.SECRET_KEY

    if (req.headers["authorization"]) {
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) {
            res.status(status?.HTTP_401_UNAUTHORIZED).json({status:401, message: "No token provided"})
        }
        jwt.verify(token, secret, async (err, payload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(status?.HTTP_403_FORBIDDEN).json({status: 403, message: "Token has expired."})
                }
                return res.status(status.HTTP_403_FORBIDDEN).json({status: 403, message: "Invalid token"})
            }

            const userId = payload?.userId
            const foundUser = await check_if_user_exist_with_id(userId)
            if (!foundUser) {
                res?.status(status?.HTTP_404_NOT_FOUND).json({status: 404, message: "Token not valid or user not found"})
            }
            req.user = userId
            next()
        })
    }
    else {
        res.status(status?.HTTP_403_FORBIDDEN).json({status: 403, message: "You are not authorized to access this route"})
    }
}
 
module.exports = authenticateUser