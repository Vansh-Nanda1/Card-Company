const express = require("express");
const app = express();
const { PORT } = require("./src/config");
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routers/user.router");

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter)
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Server Running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("ERROR .. " + err);
  });
