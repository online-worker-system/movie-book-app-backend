const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema",
    required: true,
  },
  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },
  ],
});

module.exports = mongoose.model("Screen", screenSchema);
