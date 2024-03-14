const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");

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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exists",
      });
    }

    // verify the password and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      // password is verified successfully
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
