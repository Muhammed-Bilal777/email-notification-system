const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const emailController = require("../controllers/emailController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/send-email", emailController.sendEmail);
router.post("/emails", emailController.getEmails);

module.exports = router;
