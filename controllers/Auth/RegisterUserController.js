const status = require("../../utils/status_codes")
const User = require("../../models/userModel") 
const OTP = require("../../models/otpModel")
const generateOtp = require("../../utils/otp")
const {sendEmail} = require("../../utils/email_sender") 
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

                    const otp = generateOtp()

                    const newOtp = await new OTP({
                        user: newUser?._id,
                        otp: otp,
                        otpExpiry: Date.now() + 300000
                    })  

                    await newOtp.save()

                    const email = newUser?.email
                    const subject = "OTP Verification"
                    const text = `Your OTP code is: ${otp}. IT will expires in 5 minutes`

                    await sendEmail(email, subject, text)

                    res.status(status.HTTP_200_OK).json({ message: 'OTP sent to email. Please verify your email to complete the signup' });
                }
            }
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({status: 500, message: error.message });
        }
    }

    static async verify_otp(req, res) {
        try {
            if (!req.body) {
                res.status(status.HTTP_422_UNPROCESSABLE_ENTITY).json({status: 422, message: "Unprocessible entity!"})
            }
            const {email, otp} = req.body

            // Find the user by email
            const user = await User.findOne({email})
            if (!user) {
                res.status(status.HTTP_404_NOT_FOUND).json({status: 404, message: "User not found!"})
            }
            // Find the OTP associated with the user
            const storedOtp = await OTP.findOne({user: user._id})
            if (!storedOtp) {
                res.status(status.HTTP_400_BAD_REQUEST).json({status: 400, message: "Otp not found or expired!"})
            }

            // Check if the OTP has expired
            if (storedOtp.otpExpiry < Date.now()) {
                res.status(status.HTTP_400_BAD_REQUEST).json({status: 400, message: "OTP has expired! Please sign up again!"})
            }

            // Verify OTP
            if (storedOtp.otp != otp) {
                res.status(status.HTTP_400_BAD_REQUEST).json({status: 400, message: "Invalid OTP!"})
            }

           // Mark the user as verified
            user.verified = true
            await user.save()
            
            res.status(status.HTTP_201_CREATED).json({status: 201, message: "Account activated successfully. Welcome to Truehost website. Please proceed to login. Thank you."})
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({status: 500, message: error.message });
        }
    }
}

module.exports = RegisterUser