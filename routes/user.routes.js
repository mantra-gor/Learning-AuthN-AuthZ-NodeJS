const express = require("express");
const router = express.Router();
const { Register, Login } = require("../controllers/Auth.controller.js");
const {
  auth,
  isStudent,
  isAdmin,
} = require("../middlewares/Auth.middleware.js");

router.post("/login", Login);
router.post("/register", Register);

// Protected Routes
router.post("/student", auth, isStudent, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome To Student",
  });
});

router.post("/admin", auth, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome To Admin",
  });
});

module.exports = router;
