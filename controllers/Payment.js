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
const MovieShow = require("../models/MovieShow");
// Capture Payment

exports.capturePayment = async (req, res) => {
  try {
    const { showId, movieId, cinemaId, screenId, seatsBook } = req.body;

    const userId = req.user.id;

    console.log("idhar aayaya");

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
        const findSeat = await ShowSeat.findById(seatId).populate("seatId"); // Use .lean() for plain objects

        if (findSeat.status !== "Reserved") {
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
      if (
        seat &&
        typeof seat.seatId.seatPrice === "number" &&
        !isNaN(seat.seatId.seatPrice)
      ) {
        console.log("Price of seat:", seat.seatId.seatPrice);
        amount += seat.seatId.seatPrice; // Adding price if it's valid
      } else {
        console.log("Invalid price for seat:", seat);
      }
    });

    // Razorpay order creation options
    const options = {
      amount: amount * 100, // Convert to smallest currency unit (paise for INR)
      currency: "INR",
      receipt: Math.random(Date.now()).toString(), // Generate a random receipt ID
    };

    try {
      const paymentResponse = await instance.orders.create(options);

      return res.status(200).json({
        success: true,
        data: paymentResponse,
        showId,
        seatsBook,
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
exports.verifySignature = async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    showId,
    seatsForBook,
    totalAmount,
  } = req.body;

  const io = req.io; // Get io from req (attached in middleware/router)

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
    const movieShow = await MovieShow.findById(showId);
    if (!movieShow) {
      console.log("Movie show not found");
      return res.status(401).json({
        success: false,
        message: "movie not found",
      });
    }

    // // 2. Iterate over the seatsForBook and update status for each ShowSeat
    // for (let seatId of seatsForBook) {
    //   const seat = await ShowSeat.findById(seatId);
    //   if (!seat) {
    //     console.log(`Seat with ID ${seatId} not found`);
    //     continue; // Skip to the next seat if the current one is not found
    //   }

    //   // Update the seat's status to "BOOKED"
    //   seat.status = "Booked";
    //   await seat.save();
    // }

    // Mark the seats as Booked
    const result = await ShowSeat.updateMany(
      { _id: { $in: seatsForBook }, status: "Reserved" },
      { $set: { status: "Booked", reservedAt: null } }
    );
    console.log("book res: ", result);

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Seats are not reserved or already booked.",
      });
    }

    // Emit event to notify clients about the updated seats
    io.emit("seatsUpdated", seatsForBook);

    next();
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
