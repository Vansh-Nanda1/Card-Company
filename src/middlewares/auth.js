const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.model");
const JWT_SECRET = require("../config")
const auth = async (req, res, next) => {
  const {token} = req.cookies
  if (!token){
    return res.status(401).json({ error: "Unauthorized Token" });
  } 
  try {
    const decodedToken = jwt.verify(token,"weffadfdsaffdsadfdsdfdf"); 
    const user = await userSchema.findById(decodedToken.id);
    if (!user){
        return res.status(401).json({ error: "Invalid token" });
    } 
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }
};

module.exports = auth;
