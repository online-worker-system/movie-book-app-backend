const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cityId: {
    type: Number,
    required: true,
    unique: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  state: { type: String, required: true },
  pincodes: [
    {
      type: Number,
    },
  ],
});

module.exports = mongoose.model("City", citySchema);
