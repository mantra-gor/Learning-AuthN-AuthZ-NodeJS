const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    console.log("Body: ", req.body.token);
    console.log("Cookie ", req.cookies.token);
    console.log(
      "Authorization: ",
      req.header("Authorization").replace("Bearer ", "")
    );
    const token =
      req.body.token ||
      // req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    // verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is Invalid!",
        error: error,
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong! While verifying the token",
      error: error,
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      res.status(401).json({
        success: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User is not authorized",
      error: error,
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      res.status(401).json({
        success: false,
        message: "You are not authorized!",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User is not authorized",
      error: error,
    });
  }
};
