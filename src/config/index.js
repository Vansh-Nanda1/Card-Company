require("dotenv").config()
module.exports = {
    PORT : process.env.PORT,
    // jwt_secret : process.env.JWT_SECRET,
    MONGODB_URL : process.env.MONGODB_URL
}