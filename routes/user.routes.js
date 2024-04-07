const express = require("express");
const router = express.Router();
const { Register, Login } = require("../controllers/Auth.controller.js");
const {
  auth,
  isStudent,
  isAdmin,
} = require("../middlewares/Auth.middleware.js");


// home screen for api documentations
const fs = require("fs");
const path = require("path");

const apiDocsPath = path.join(__dirname, "../apiDocs.html");
const apiDocs = fs.readFileSync(apiDocsPath, "utf8");

router.get("/", (req,res) => {
  res.send(apiDocs)
})

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
