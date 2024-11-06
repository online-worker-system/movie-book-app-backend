const mongoose = require("mongoose");

const Genre = ["ACTION", "COMEDY", "DRAMA", "THRILLER", "SCI-FI"];
const Language = ["ENGLISH", "HINDI", "SPANISH", "FRENCH"];

const movieSchema = new mongoose.Schema({
  movieName: {
    type: String,
    required: true,
  },
  releaseDate: { type: Date, required: true },
  summary: {
    type: String,
  },
  genres: [
    {
      type: String,
      enum: Genre,
    },
  ],
  castMembers: [
    {
      type: String,
    },
  ],
  supportingLanguages: [
    {
      type: String,
      enum: Language,
    },
  ],
  thumbnail: {
    type: String,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
