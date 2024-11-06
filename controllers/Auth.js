const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// require("dotenv").config();

// sendOTP
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body
    const { email } = req.body;

    // check of user already exist
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate unique otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated: ", otp);

    const result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      result = await OTP.findOne({ otp: otp });
    }

    // create an entry for OTP
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("otpBody: ", otpBody);

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.log("OTP sent nhi kar paya: ", error);
    return res.status(500).json({
      success: false,
      message: "OTP not sent",
      error: error,
    });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    // data fecth from request ki body
    const {
      userName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    console.log("reqBody: ", req.body);

    // validate krlo
    if (
      !userName ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // password match karlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password adn ConfirmPassword",
      });
    }

    // check user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("recent Otp is : ", recentOtp);

    // validate OTP
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      console.log("otps: ", otp, recentOtp[0].otp);
      return res.status(400).json({
        success: false,
        message: "OTP not matched",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating user entry in DB
    const user = await User.create({
      userName,
      email,
      password,
      contactNumber,
      password: hashedPassword,
      accountType,
    });

    return res.status(200).json({
      success: true,
      message: "Signup successfully hua",
      user: user,
    });
  } catch (error) {
    console.log("Signup nhi kar paya: ", error);
    return res.status(500).json({
      success: false,
      message: "Signup nhi ho paya kuch dikat aa gayi",
      error: error,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // get data from req body
    const { email, password } = req.body;

    // validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try later",
      });
    }

    // user check exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registerd, please signup first",
      });
    }

    // match a password
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.accountType,
      };

      // generate JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      // create a cookie and send a response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Pasword not matched",
      });
    }
  } catch (error) {
    console.log("login is not possible ", error);
    return res.status(500).json({
      success: false,
      message: "Login nhi ho paya kuch dikat aa gayi",
      error: error,
    });
  }
};