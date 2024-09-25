const express = require("express")
const router = express.Router()
const registerUserController = require("../controllers/Auth/RegisterUserController")
const validateUserInputForSignUp = require("../middleware/validatorMiddleware")

router.post("/signup/", validateUserInputForSignUp, registerUserController.signup) 
router.post("/verify_otp/", registerUserController.verify_otp) 

module.exports = router