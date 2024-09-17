const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const connectToDB = require("./dbConnect/mongoDB")

const movieRouter = require("./routers/movieRouter")
const registerRouter = require("./routers/registerRouter")
const authRouter = require("./routers/authRoute")


app.use(express.json())

// Routes
app.use("/api/v1/movies", movieRouter)
app.use("/api/v1/users", registerRouter)
app.use("/api/v1/auth", authRouter)

const port = process.env.PORT || 3000

app.listen(port, async () => {
    await connectToDB()
    console.log(`Listening on port ${port} on the local server`);
})