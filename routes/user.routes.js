const express = require("express");
const router = express.Router();
const { Register } = require("../controllers/Auth.controller.js");

// router.post("/login", login);
router.post("/register", Register);

module.exports = router;
