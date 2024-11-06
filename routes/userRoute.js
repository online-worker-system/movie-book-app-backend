const express = require("express");
const router = express.Router();

const { login, signup, sendOTP } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/sendotp", sendOTP);
router.post("/login", login);

module.exports = router;