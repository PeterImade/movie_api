const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const connectToDB = require("./dbConnect/mongoDB")
const movieRouter = require("./routers/movieRouter")

app.use(express.json())
app.use("/api/v1/movies", movieRouter)

const port = process.env.PORT || 3000

app.listen(port, async () => {
    await connectToDB()
    console.log(`Listening on port ${port} on the local server`);
})