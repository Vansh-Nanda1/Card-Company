const { Router } = require("express");
const router = Router();
const userSchema = require("../models/user.model");
const { generateToken } = require("../utils/generate.jwt");

exports.registerUser = async (req, res) => {
  try {
    const { password, lastName, email, firstName } = req.body;
    const findUser = await userSchema.findOne({ email });
    if (findUser) {
      throw new Error("Email already in use");
    }
    const user = new userSchema({
      firstName,
      lastName,
      password,
      email,
    });
    await user.save();
    res.send("user added sucessfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    // Validate the password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = await generateToken(user._id);

    // Set cookie with the token
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // 8 hours
      httpOnly: true,
    });

    res.status(200).json({ message: "Logged in successfully"});

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logoutUser = async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout sucessfully");
};
