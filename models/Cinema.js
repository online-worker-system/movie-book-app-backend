const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema({
  cinemaId: {
    type: Number,
    required: true,
    unique: true,
  },
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
    type: Number,
    ref: "City",
    required: true,
  },
});

module.exports = mongoose.model("Cinema", cinemaSchema);
