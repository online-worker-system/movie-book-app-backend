const mongoose = require("mongoose");

const BookingStatus = ["BOOKED", "CANCELLED"];

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: Number,
    required: true,
    unique: true,
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MovieShow",
    required: true,
  },
  bookedSeats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowSeat",
    },
  ],
  status: {
    type: String,
    enum: BookingStatus,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  txnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
