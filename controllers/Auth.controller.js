const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
require("dotenv").config();

exports.Register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check is user (email) is already exists
    const isUserAlreadyExists = await User.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with the same email id",
      });
    }

    // Securing the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 16);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing password",
        error: error,
      });
    }

    // create user
    const user = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully Created an Account",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exists",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    // verify the password and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      // password is verified successfully
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user = user.toObject();
      user.token = token;
      user.password = undefined;

      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      return res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully!",
      });
    } else {
      // password do not match
      return res.status(403).json({
        success: false,
        message: "Password Incorrect",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};
