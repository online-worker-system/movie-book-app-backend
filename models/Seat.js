const mongoose = require("mongoose");

const SeatType = ["REGULAR", "VIP", "BALCONY"]; // add as needed

const seatSchema = new mongoose.Schema({
  // screenId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Screen",
  //   required: true,
  // },
  seatType: {
    type: String,
    enum: SeatType,
    required: true,
  },
  seatNumber: {
    type:Number,
    required: true,
  },
  // row: {
  //   type: String,
  //   required: true,
  // },
  // colNo: {
  //   type: Number,
  //   required: true,
  // },
});

module.exports = mongoose.model("Seat", seatSchema);
