const mongoose = require("mongoose")
const { MONGODB_URL } = require(".")
const connectDB = async (req,res) =>{
await mongoose.connect(MONGODB_URL)
}
module.exports = connectDB