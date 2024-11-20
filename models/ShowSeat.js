const mongoose = require("mongoose");

const SeatStatus = ["Available", "Booked", "Reserved"];

const showSeatSchema = new mongoose.Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true,
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MovieShow",
    required: true,
  },
  status: {
    type: String,
    enum: SeatStatus,
    required: true,
  },
  reservedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("ShowSeat", showSeatSchema);
