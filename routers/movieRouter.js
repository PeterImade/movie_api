const express = require("express")
const router = express.Router()
const movieController = require("../controllers/MovieController")
const authenticateUser = require("../middleware/authMiddleware")

router.post("/", authenticateUser, movieController.create_movie)
router.get("/", movieController.fetch_movies)
router.get("/:id", movieController.fetch_one_movie)
router.put("/:id", authenticateUser, movieController.update_movie)
router.delete("/:id", authenticateUser, movieController.delete_movie)


module.exports = router