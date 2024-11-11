const express = require("express");
const router = express.Router();

const { login, signup, sendOTP } = require("../controllers/Auth");
const { auth } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/sendotp", sendOTP);
router.post("/login", login);
router.get("/testToken", auth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "good",
  });
});

module.exports = router;
