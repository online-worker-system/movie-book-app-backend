const mongoose = require("mongoose");

const movieShowSchema = new mongoose.Schema({
  showStart: {
    type: Date,
    required: true,
  },
  showEnd: {
    type: Date,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true,
  },
  isLive: {
    type: Boolean,
  },
  showSeats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShowSeat",
    },
  ],
});

module.exports = mongoose.model("MovieShow", movieShowSchema);
