const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_STRING)
        return console.log("database connected successfully");
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = connectToDB