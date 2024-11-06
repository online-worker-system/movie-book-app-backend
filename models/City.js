const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
  cityName: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },

  // state: { type: String, required: true },
  // pincodes: [
  //   {
  //     type: Number,
  //   },
  // ],
});

module.exports = mongoose.model("City", citySchema);
