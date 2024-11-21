const express = require("express");
const router = express.Router();

const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../controllers/Payment");
const { auth, isViewer } = require("../middlewares/auth");
const { bookShow } = require("../controllers/Booking");

module.exports = (io) => {
  // Middleware to attach io to req
  const attachIO = (req, res, next) => {
    req.io = io; // Attach io instance to req object
    next();
  };

  router.post("/capturePayment", auth, isViewer, capturePayment);
  router.post(
    "/verifyPayment",
    auth,
    isViewer,
    attachIO, // Attach io before calling verifySignature
    verifySignature,
    bookShow
  );
  // router.post(
  //   "/sendPaymentSuccessEmail",
  //   auth,
  //   isViewer,
  //   sendPaymentSuccessEmail
  // );

  return router;
};
