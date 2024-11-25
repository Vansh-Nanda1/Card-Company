const jwt = require("jsonwebtoken")
// const JWT_SECRET =require("../config/index")

exports.generateToken =async (id) =>{
      return jwt.sign({id},"weffadfdsaffdsadfdsdfdf",{
    //   return jwt.sign({id},process.env.JWT_SECRET,{
           expiresIn : "1d"
       })
   }

