const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../controllers/Payment");
const { auth, isViewer } = require("../middlewares/auth");

router.post("/capturePayment", auth, isViewer, capturePayment);
// router.post("/verifyPayment", auth, isViewer, verifySignature);
// router.post(
//   "/sendPaymentSuccessEmail",
//   auth,
//   isViewer,
//   sendPaymentSuccessEmail
// );

module.exports = router;
