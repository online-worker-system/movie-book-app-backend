const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../controllers/Payment");
const { auth, isViewer } = require("../middlewares/auth");
const { bookShow } = require("../controllers/Booking");

router.post("/capturePayment", auth, isViewer, capturePayment);
router.post("/verifyPayment", auth, isViewer, verifySignature, bookShow);
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isViewer,
//   sendPaymentSuccessEmail
// );

module.exports = router;
