const Movie = require("../models/movieModel")
const status = require("../utils/status_codes")
const mongoose = require("mongoose")

class MovieController {
    static async create_movie(req, res) {
        try {
            if (!req.user) {
                res.status(status?.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are not authorized to perform this request" })
            }
            if (!req.body) {
                res.status(status.HTTP_422_UNPROCESSABLE_ENTITY).json({ status: 422, message: "Unprocessible entity. Please provide a valid data" })
            }
            const movie = await new Movie({
                title: req.body.title,
                genre: req.body.genre,
                director: req.body.director,
                description: req.body.description,
                year: req.body.year,
                user: req.user,
                is_active: req.body.is_active
            })


            await movie.save()

            res.status(status.HTTP_201_CREATED).json({ status: 201, data: movie, message: "Movie created successfully" })
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }

    static async fetch_movies(req, res) {
        try {
            const movies = await Movie.find({})
            if (!movies) {
                res.status(status.HTTP_404_NOT_FOUND).json({ status: 404, message: "Movie not found" })
            }
            res.status(status.HTTP_200_OK).json({ status: 200, data: movies, message: "Movies retrieved successfully" })
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }

    static async fetch_one_movie(req, res) {
        try {
            const { id } = req.params
            if (!id) {
                res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: "Please provide an Id." })
            }
            const movie = await Movie.findOne({ _id: id }).populate("user", "_id email")
            if (!movie) {
                return res.status(status.HTTP_404_NOT_FOUND).json({ status: 404, message: `Movie with id:${id} not found` })
            }
            res.status(status.HTTP_200_OK).json({ status: 200, data: movie })
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }

    static async update_movie(req, res) {
        try {
            if (!req.user) {
                return res.status(status?.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are not authorized to perform this request" })
            }
            const { id } = req.params
            if (!id) {
                res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: "Please provide an Id." })
            }

            if (!req.body) {
                return res.status(status.HTTP_422_UNPROCESSABLE_ENTITY).json({ status: 422, message: "Unprocessible entity. Please provide a valid data" })
            }
            const movie_to_update = await Movie.findOne({ _id: id }).populate("user")

            if (!movie_to_update) {
                return res.status(status.HTTP_404_NOT_FOUND).json({ status: 404, message: `Movie with id:${id} not found` })
            }
  
            if (!(movie_to_update.user._id.toString() === req.user)) {
                return res.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are authorized to perform this request or you are not the one who created this movie" })
            }


            movie_to_update.title = req.body.title
            movie_to_update.genre = req.body.genre
            movie_to_update.director = req.body.director
            movie_to_update.description = req.body.description
            movie_to_update.year = req.body.year
            movie_to_update.is_active = req.body.is_active

            console.log(movie_to_update);
            
            await movie_to_update.save()

            res.status(status.HTTP_200_OK).json({ status: 200, message: "Movie updated successfully", data: movie_to_update })

        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }

    static async delete_movie(req, res) {
        try {
            if (!req.user) {
                return res.status(status?.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are not authorized to perform this request" })
            }
            const { id } = req.params
            if (!id) {
                res.status(status.HTTP_400_BAD_REQUEST).json({ status: 400, message: "Please provide an Id." })
            }
            const movie_to_delete = await Movie.findOne({ _id: id }).populate("user")
            if (!movie_to_delete) {
                return res.status(status.HTTP_404_NOT_FOUND).json({ status: 404, message: `Movie with id:${id} not found` })
            }
            if (!(movie_to_delete.user._id.toString() === req.user)) {
                return res.status(status.HTTP_401_UNAUTHORIZED).json({ status: 401, message: "You are authorized to perform this request or you are not the one who created this movie" })
            }
            await Movie.findByIdAndDelete({ _id: movie_to_delete._id })

            return res.status(status.HTTP_204_NO_CONTENT).json({ status: 204, data: {} })
        } catch (error) {
            res.status(status.HTTP_500_INTERNAL_SERVER_ERROR).json({ status: 500, message: error?.message })
        }
    }
}

module.exports = MovieController