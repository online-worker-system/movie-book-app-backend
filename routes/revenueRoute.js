const express = require("express");
const router = express.Router();

const {
  getAdminRevenueDetails,
  getRevenueDetailsByCity,
  getRevenueByCityId,
  getAdminDetails,
  getAdminRevenueByCity,
  getAdminRevenueByCityId
} = require("../controllers/Revenue");
const { auth, isAdmin, isSuperAdmin } = require("../middlewares/auth");

router.post("/admin-city-revenue", auth, isAdmin, getAdminRevenueByCityId);
router.get("/admin-cities-revenue", auth, isAdmin, getAdminRevenueByCity);

router.get("/admins-details", auth, isSuperAdmin, getAdminDetails);
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
