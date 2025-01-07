const express = require("express");
const router = express.Router();

const { login, signup, sendOTP } = require("../controllers/Auth");
const {
  getAdminRevenueDetails,
  getRevenueDetailsByCity,
  getRevenueByCityId,
} = require("../controllers/Revenue");
const { auth, isSuperAdmin } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/sendotp", sendOTP);
router.post("/login", login);
router.post("/city-revenue-details", auth, isSuperAdmin, getRevenueByCityId);
router.get("/superadmin-revenue-details", auth, isSuperAdmin, getRevenueDetailsByCity);
router.post(
  "/admin-revenue-details",
  auth,
  (req, res, next) => {
    if (
      req.user &&
      (req.user.role === "Admin" || req.user.role === "SuperAdmin")
    ) {
      return next();
    }
    return res.status(403).json({ message: "Access denied not a valid user" });
  },
  getAdminRevenueDetails
);

module.exports = router;
