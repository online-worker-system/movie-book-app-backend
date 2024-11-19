const mongoose = require("mongoose");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const Transaction = require("../models/Transaction");
const Booking = require("../models/Booking");
const User = require("../models/User");
const { instance } = require("../config/razorpay");
const Show = require("../models/MovieShow");
const ShowSeat = require("../models/ShowSeat");
const { compareSync } = require("bcrypt");
// Capture Payment

exports.capturePayment = async (req, res) => {
  try {
    const { showId, movieId, cinemaId, screenId, seatsBook } = req.body;
    console.log(req.body);
    const userId = req.user.id;

    console.log("HEllo")
    // Validate booking ID
    const show = await Show.findById(showId).populate("showSeats");

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Invalid show ID or show not found",
      });
    }

    const findSeats = await Promise.all(
      seatsBook.map(async (seatId) => {

        console.log(seatId)
        const findSeat = await ShowSeat.findById(seatId).populate("seatId") // Use .lean() for plain objects
        console.log("findSeat object:", findSeat);

        if (findSeat.status !== "FREE" && findSeat.status !== "Available") {
          return res.status(400).json({
            success: false,
            message: "Seat is already booked recently!",
          });
        }
        return findSeat;
      })
    );

    console.log("Found Seats:", findSeats);

    // Initialize amount to 0
    let amount = 0;

    // Using forEach to sum up the price
    findSeats.forEach((seat) => {
      if (seat && typeof seat.price === 'number' && !isNaN(seat.price)) {
        console.log("Price of seat:", seat.price);
        amount += seat.price; // Adding price if it's valid
      } else {
        console.log("Invalid price for seat:", seat);
      }
    });

    console.log("Total Amount:", amount);

    // Razorpay order creation options
    const options = {
      amount: amount * 100, // Convert to smallest currency unit (paise for INR)
      currency: "INR",
      receipt: Math.random(Date.now()).toString(), // Generate a random receipt ID
    };

    console.log("Order options:", options);

    try {
      const paymentResponse = await instance.orders.create(options);

      return res.status(200).json({
        success: true,
        data: paymentResponse,
        message: "Payment initiated successfully",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Could not initiate payment",
        error: err.message,
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error capturing payment",
      error: err.message,
    });
  }
};


// Verify Payment Signature
exports.verifySignature = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }

  try {
    // Update booking and create transaction
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "BOOKED" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const transaction = new Transaction({
      txnId: Math.floor(100000 + Math.random() * 900000), // Random 6-digit txnId
      referenceId: booking._id,
      status: "SUCCESS",
      amount: booking.totalAmount,
    });

    await transaction.save();

    // Update booking with transaction ID
    booking.txnId = transaction._id;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: err.message,
    });
  }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  try {
    const { bookingId, txnId } = req.body;
    const userId = req.user.id;

    // Fetch booking and user details
    const booking = await Booking.findById(bookingId).populate("userId");
    const user = booking?.userId;

    if (!booking || !user || user._id.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or user not authorized",
      });
    }

    // Send payment success email
    await mailSender(
      user.email,
      "Payment Successful - Movie Booking",
      `Dear ${user.userName},\n\nYour payment of ₹${booking.totalAmount} has been successfully processed for the booking (Txn ID: ${txnId}). Enjoy your show!\n\nThank you for choosing our service!`
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error sending payment success email",
      error: err.message,
    });
  }
};
