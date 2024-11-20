const mongoose = require("mongoose");

const movieShowSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema",
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  showStart: {
    type: Date,
    required: true,
  },
  showEnd: {
    type: Date,
    required: true,
  },
  isLive: {
    type: Boolean,
    required: true,
  },
  timing: {
    type: String,
    enum: ["9-12am", "3-6pm", "9-12pm"],
    required: true,
  },
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true,
  },
  showSeats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowSeat",
    },
  ],
});

module.exports = mongoose.model("MovieShow", movieShowSchema);
