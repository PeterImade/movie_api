const mongoose = require("mongoose")

const MovieSchema = mongoose.Schema({
    title: {type: String, required: true, trim: true},
    genre: {type: String, required: true, trim: true},
    director: {type: String, required: true},
    description: {type: String, required: true},
    year: {type: String, required: true},
    is_active: {type: Boolean, default: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
},
)
const Movie = mongoose.model("Movie", MovieSchema)

module.exports = Movie;

