const express = require("express")
const router = express.Router()
const movieController = require("../controllers/MovieController")

router.post("/", movieController.create_movie)
router.get("/", movieController.fetch_movies)
router.get("/:id", movieController.fetch_one_movie)
router.put("/:id", movieController.update_movie)
router.delete("/:id", movieController.delete_movie)


module.exports = router