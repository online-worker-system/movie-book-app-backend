const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
  cinemaName: {
    type: String,
    required: true,
  },
  screens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
    },
  ],
  pincode: {
    type: Number,
    required: true,
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  adminDetailes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Cinema", cinemaSchema);
