const express = require("express");
const router = express.Router();

const { fetchAllTickets } = require("../controllers/Booking");
const { auth, isViewer } = require("../middlewares/auth");

router.get("/fetchBookings", auth, isViewer, fetchAllTickets);

module.exports = router;
