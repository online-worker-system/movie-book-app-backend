// const user = require("../models/User");
const jwt = require("jsonwebtoken");

// auth
exports.auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token || token === undefined) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: "somthing went wrong while validating token",
    });
  }
};

// isViewer
exports.isViewer = async (req, res, next) => {
  try {
    if (req.user.role !== "Viewer") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Viewer",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role cannot be verified, please try later",
    });
  }
};

// isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role cannot be verified, please try later",
    });
  }
};

// isSuperAdmin
exports.isSuperAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for SuperAdmin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Role cannot be verified, please try later",
    });
  }
};
