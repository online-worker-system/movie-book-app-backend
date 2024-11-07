const mongoose = require("mongoose");

const SeatStatus = ["FREE", "OCCUPIED", "LOCKED"];

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
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: SeatStatus,
    required: true,
  },
});


module.exports = mongoose.model("ShowSeat", showSeatSchema);
