const mongoose = require("mongoose");

const movieShowSchema = new mongoose.Schema({
  showId: {
    type: Number,
    required: true,
    unique: true,
  },
  showTime: {
    type: Date,
    required: true,
  },
  movieId: {
    type: Number,
    ref: "Movie",
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
