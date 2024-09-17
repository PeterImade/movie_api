const express = require("express")
const router = express.Router()
const authenticateUserController = require("../controllers/Auth/AuthenticateUserController")

router.post("/login/", authenticateUserController.login)
router.post("/refresh_token/", authenticateUserController.refresh_token)

module.exports = router
